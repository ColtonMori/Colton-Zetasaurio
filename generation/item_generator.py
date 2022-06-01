import json
import random
from hashlib import sha256
from typing import Dict, List, Set

import colorama
from PIL.Image import Image
from PIL import Image as ImageModule

import util
from config import Rule, config
from models import Feature, Item, Layer
from layers_reader import read_layers


def build_image(layers: List[Image]) -> Image:
  mode = 'RGBA'
  dimensions = (config.width, config.height)
  transparent = (0, 0, 0, 0)

  image = ImageModule.new(mode, dimensions, transparent)

  for layer in layers:
    image.alpha_composite(layer)

  return image


def select_random_feature(layer: Layer):
  random_percent = util.generate_random_percent()

  percent_sum = 0
  for feature in layer.features:
    percent_sum += feature.rarity
    if percent_sum >= random_percent:
      return feature

  assert percent_sum == 100, "Rarity sum of layer must be 100, this shouldn't happen."

def rule_applies(rule: Rule, combination: Dict[str, Feature]):
  applies = combination[rule.layer_from].name in rule.feature_from

  if hasattr(rule, 'probability'):
    applies = applies and (random.random() > rule.probability)

  return applies

def apply_rule(rule: Rule, combination: Dict[str, Feature]):
  combination[rule.layer_to] = combination[rule.layer_to].layer.get_feature(rule.feature_to)

def apply_rules(combination: Dict[str, Feature]) -> List[Feature]:
  for rule in config.rules:
    if rule_applies(rule, combination):
      apply_rule(rule, combination)

  return combination.values()

def generate_combination(layers: List[Layer]):
  combination = {}
  for layer in layers:
    combination[layer.name] = select_random_feature(layer)

  return combination

def generate_item_data(
  id: int,
  layers: List[Layer],
  dna_used: Set[str]
) -> Item:
  while(True):
    combination = generate_combination(layers)
    features = apply_rules(combination)
    item = Item(id, features)

    if (item.dna not in dna_used):
      dna_used.add(item.dna)
      return item

def generate_item_image(item: Item) -> Image:
  image_paths = list(map(lambda feature: feature.path, item.features))
  image_layers = list(map(ImageModule.open, image_paths))
  image = build_image(image_layers)

  image.save(util.item_image_path(item.id))

  return image

def generate_item_metadata(item: Item, image: Image):
  item.generate_provenance(image)
  metadata = item.generate_metadata()

  with open(util.item_metadata_path(item.id), "w") as metadata_file:
    json.dump(metadata, metadata_file, indent=4)

def generate_item(id: int, layers: List[Layer], dna_used: Set[str], total: int) -> Item:
  progress = util.cyan(f'{id}/{total}')
  print(f'Generating {progress} items...', end='\r')

  item = generate_item_data(id, layers, dna_used)

  util.create_items_images_path()
  image = generate_item_image(item)

  util.create_items_metadata_path()
  generate_item_metadata(item, image)

  return item

def store_provenance(provenances: dict):
  full_provenance = ''.join(provenances.values())
  full_provenance = sha256(full_provenance.encode()).hexdigest()
  provenance_metadata = {
    "full_provenance": full_provenance,
    "provenances": provenances
  }

  with open(util.items_provenance_path(), "w") as provenance_file:
    json.dump(provenance_metadata, provenance_file, indent=4)

def generate_items(amount: int):
  random.seed(config.random_seed)
  colorama.init()

  dna_used = set()  
  layers = read_layers()
  provenances = {}
  items = []

  for id in range(1, amount + 1):
    item = generate_item(id, layers, dna_used, amount)
    items.append(item)
    provenances[id] = item.provenance

  store_provenance(provenances)

  progress = util.cyan(f'{amount}/{amount}')
  print(f'Generating {progress} items...' + util.green('Done!'))

  return items

import json
from types import SimpleNamespace
from typing import List

class Rule(SimpleNamespace):
  layer_from: str
  layer_to: str
  feature_from: List[str]
  feature_to: str
  probability: float

class Config(SimpleNamespace):
  collection_name: str
  collection_description: str
  base_image_uri: str
  width: int
  height: int
  max_items: int
  items_dir: str
  layers_dir: str
  order_separator: str
  rarity_separator: str
  random_seed: int
  omit_in_dna: List[str]
  rules: List[Rule]

def get_config() -> Config:
  config_file = open('generation-config.json')
  config = json.load(config_file, object_hook=lambda d: Config(**d))

  return config

config = get_config()
import os
import colorama
from psd_tools import PSDImage

import util
from config import config


def validate_feature_layer(layer):
  pass
  # assert layer.kind == 'pixel', f'Layer {layer.name} should be a pixel layer.'

def validate_group_layer(layer):
  assert layer.kind == 'group', f'Layer {layer.name} should be a layer group.'

  for feature in layer:
    validate_feature_layer(feature)

def validate_psd(psd: PSDImage):
  print('Validating PSD File...', end='\r')

  for layer in psd:
    validate_group_layer(layer)

  print('Validating PSD file...' + colorama.Fore.GREEN + 'Done!' + colorama.Fore.RESET)

def create_layers_dir():
  if not os.path.exists(config.layers_dir):
    os.mkdir(config.layers_dir)

def create_layer_dir(layer_name, layer_order):
  layer_path = util.layer_path(layer_name, layer_order)

  if not os.path.exists(layer_path):
    os.mkdir(layer_path)

def create_feature_file(feature: PSDImage, layer_dir):
  feature.visible = True
  feature_path = util.feature_path(feature.name, layer_dir)
  feature_image = feature.composite()
  feature_image.save(feature_path)

def import_feature(feature: PSDImage, layer_dir: str):
  print(f'Importing feature {colorama.Fore.CYAN + feature.name + colorama.Fore.RESET}...', end='\r')

  create_feature_file(feature, layer_dir)

  print(f'Importing feature {colorama.Fore.CYAN + feature.name + colorama.Fore.RESET}...' + colorama.Fore.GREEN + 'Done!' + colorama.Fore.RESET)

def import_layer(layer: PSDImage, order: int):
  print(f'Importing layer {colorama.Fore.CYAN + layer.name + colorama.Fore.RESET}...', end='\r')

  create_layer_dir(layer.name, order)
  for feature in layer:
    import_feature(feature, util.layer_dir(layer.name, order))

  print(f'Importing layer {colorama.Fore.CYAN + layer.name + colorama.Fore.RESET}...' + colorama.Fore.GREEN + 'Done!' + colorama.Fore.RESET)

def import_psd(psd: PSDImage):
  print('Importing layers from PSD file...', end='\r')

  create_layers_dir()
  for order, layer in enumerate(psd):
    import_layer(layer, order)

  print('Importing layers from PSD file...' + colorama.Fore.GREEN + 'Done!' + colorama.Fore.RESET)

def import_psd_file(psd_file):
  colorama.init()

  psd = PSDImage.open(psd_file)

  validate_psd(psd)
  import_psd(psd)
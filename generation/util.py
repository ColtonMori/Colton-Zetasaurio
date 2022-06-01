import os
import random
from os import path

import colorama

from config import config

def generate_random_percent():
  ''' Generates random int between 1 and 100 inclusive. '''
  return random.uniform(0, 100)

def layer_dir(layer_name, order=None):
  order = '' if order is None else config.order_separator + str(order)

  return layer_name + order

def layer_path(layer_name, order=None):
  return path.join(config.layers_dir, layer_dir(layer_name, order))

def feature_path(feature_name, layer_name, add_extension=True):
  extension = '.png' if add_extension else ''

  return path.join(layer_path(layer_name), feature_name + extension)

def create_items_images_path():
  images_path = path.join(config.items_dir, 'images')

  if not path.exists(images_path):
    os.makedirs(images_path)

def items_provenance_path():
  return path.join(config.items_dir, 'provenance.json')

def items_metadata_path():
  return path.join(config.items_dir, 'metadata')

def create_items_metadata_path():
  metadata_path = items_metadata_path()

  if not path.exists(metadata_path):
    os.makedirs(metadata_path)

def item_image_path(id: int):
  return path.join(config.items_dir, 'images', f'{id}.png')

def item_metadata_path(id: int):
  return path.join(config.items_dir, 'metadata', f'{id}.json')

def cyan(text):
  return colorama.Fore.CYAN + str(text) + colorama.Fore.RESET

def green(text):
  return colorama.Fore.GREEN + str(text) + colorama.Fore.RESET
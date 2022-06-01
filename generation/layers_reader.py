import os
from os import path
from typing import List
import util
from config import config
from models import Feature, Layer

def split_feature_file(feature_file: str) -> tuple:
  without_extension = path.splitext(feature_file)[0]
  (feature_name, feature_rarity) = without_extension.split(config.rarity_separator)

  return (feature_name, float(feature_rarity))

def read_feature(feature_file: str, layer_dir: str) -> Feature:
  feature_path = util.feature_path(feature_file, layer_dir, False)
  (feature_name, feature_rarity) = split_feature_file(feature_file)

  return Feature(feature_name, feature_path, feature_rarity)

def split_layer_dir(layer_dir: str) -> tuple:
  without_extension = path.splitext(layer_dir)[0]
  (layer_name, layer_order) = without_extension.split(config.order_separator)

  return (layer_name, int(layer_order))

def read_layer(layer_dir: str) -> Layer:
  (layer_name, layer_order) = split_layer_dir(layer_dir)
  layer_path = util.layer_path(layer_dir)
  feature_files = os.listdir(layer_path)
  features = [read_feature(feature_file, layer_dir) for feature_file in feature_files]

  return Layer(layer_name, layer_order, features)


def read_layers() -> List[Layer]:
  layer_names = os.listdir(config.layers_dir)
  layers = list(map(read_layer, layer_names))
  layers.sort(key=lambda layer: layer.order)

  return layers

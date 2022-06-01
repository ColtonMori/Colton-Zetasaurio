from typing import List
from models import Item
from config import config
from os import mkdir, path
import matplotlib.pyplot as plt
from layers_reader import read_layers


def init_layer_distribution() -> dict:
  layers = read_layers()
  layers_distribution = {}
  for layer in layers:
    layers_distribution[layer.name] = {}

    for feature in layer.features:
      layers_distribution[layer.name][feature.name] = 0

  return layers_distribution


def build_layer_distribution(items: List[Item]) -> dict:
  layers_distribution = init_layer_distribution()

  for item in items:
    for feature in item.features:
      layers_distribution[feature.layer.name][feature.name] += 1

  return layers_distribution


def plot_layer_distribution(layer_name: str, layer_distribution: dict):
  total = 0
  labels = []
  distribution = []
  for feature_name in layer_distribution:
    total += layer_distribution[feature_name]
    distribution.append(layer_distribution[feature_name])

  for feature_name in layer_distribution:
    percent = layer_distribution[feature_name] / total * 100
    labels.append('%s (%1.1f%%)' % (feature_name, percent))

  fig, ax = plt.subplots(figsize=(12, 8))
  fig.subplots_adjust(0.3, 0, 1, 1)
  ax.set_title(layer_name)
  ax.pie(
    distribution,
    shadow=True,
    autopct='%1.1f%%',
    wedgeprops = {
      "edgecolor" : "white",
      "linewidth": 2,
      "antialiased": True
      }
    )
  ax.legend(
    loc='upper left',
    labels=labels,
    prop={'size': 11},
    bbox_to_anchor=(0.0, 1),
    bbox_transform=fig.transFigure
  )

  plt.savefig(path.join(config.items_dir, 'stats', layer_name))


def plot_layers_distribution(items: List[Item]):
  try:
    mkdir(path.join(config.items_dir, 'stats'))
  except:
    pass

  layers_distribution = build_layer_distribution(items)
  for layer_name in layers_distribution:
    plot_layer_distribution(layer_name, layers_distribution[layer_name])

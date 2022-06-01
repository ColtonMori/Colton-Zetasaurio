from typing import List
from hashlib import sha1, sha256

from PIL.Image import Image

from config import config

class Feature:
  def __init__(self, name: str, path: str, rarity: int):
    self.name = name
    self.path = path
    self.rarity = rarity
    self.layer = None

  def __repr__(self) -> str:
    return 'Feature{name="%s", path="%s", rarity=%f}' % (self.name, self.path, self.rarity)

  def generate_metadata(self):
    return {
      "trait_type": self.layer.name,
      "value": self.name
    }


class Layer:
  def __init__(self, name: str, order: int, features: List[Feature] = []):
    self.name = name
    self.order = order
    self.features = features
    
    for feature in features:
      feature.layer = self

  def __repr__(self) -> str:
    features_str_list = list(map(lambda feature: str(feature), self.features))
    features_pretty_str = '\n\t'.join(features_str_list)

    return 'Layer{name="%s", order=%d, features=[\n\t%s\n]}' % (self.name, self.order, features_pretty_str)

  def get_feature(self, feature_name: str):
    for feature in self.features:
      if feature.name == feature_name:
        return feature

    return None

class Item:
  def __init__(self, id: int, features: List[Feature]):
    self.id = id
    self.features = features
    self.dna = self.generate_dna()

  def __repr__(self) -> str:
    features_str_list = list(map(lambda feature: str(feature), self.features))
    features_pretty_str = '\n\t'.join(features_str_list)

    return 'Item{id=%d, dna="%s", features=[\n\t%s\n]}' % (self.id, self.dna, features_pretty_str)

  def generate_dna(self) -> str:
    filtered_features = [feature for feature in self.features if feature.layer.name not in config.omit_in_dna]
    feature_names = list(map(lambda feature: feature.name, filtered_features))
    feature_names_concat = ''.join(feature_names)
    sha1_obj = sha1(feature_names_concat.encode())
    
    return sha1_obj.hexdigest()

  def generate_provenance(self, image: Image) -> str:
    self.provenance = sha256(image.tobytes()).hexdigest()

  def generate_metadata(self) -> str:
    attributes = list(map(lambda feature: feature.generate_metadata() ,self.features))
    metadata = {
      "name": f'{config.collection_name} #{self.id}',
      "dna": self.dna,
      "provenance": self.provenance,
      "description": config.collection_description,
      "image": config.base_image_uri.replace('{id}', str(self.id)),
      "attributes": attributes
    }
    
    return metadata

  
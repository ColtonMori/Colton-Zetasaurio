import os
from os import path

import util

def update_item_base_cid(id: int, cid: str, metadata_file_path: str, total: int):
  progress = util.cyan(f'{id}/{total}')
  print(f'Updating metadata of {progress} items...', end='\r')

  with open(metadata_file_path, "r") as metadata_file:
    metadata = metadata_file.read()

  metadata = metadata.replace('{base_cid}', cid)

  with open(metadata_file_path, "w") as metadata_file:
    metadata_file.write(metadata)

def update_base_cid(cid: str):
  metadata_path = util.items_metadata_path()
  metadata_file_names = os.listdir(metadata_path)
  total_items = len(metadata_file_names)

  for index, metadata_file_name in enumerate(metadata_file_names):
    metadata_file_path = path.join(metadata_path, metadata_file_name)
    update_item_base_cid(index + 1, cid, metadata_file_path, total_items)

  progress = util.cyan(f'{total_items}/{total_items}')
  print(f'Updating metadata of {progress} items...' + util.green('Done!'))
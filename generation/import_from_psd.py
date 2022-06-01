import os
import argparse
import psd_importer


class LoadFromPSDArgs(argparse.Namespace):
  psd_file: str


def validate_args(args: LoadFromPSDArgs):
  if not os.path.exists(args.psd_file) or os.path.isdir(args.psd_file):
    raise FileNotFoundError('The PSD file provided does not exists.')

def parse_args() -> LoadFromPSDArgs:
  parser = argparse.ArgumentParser('Load collection layers from a PSD file.')
  parser.add_argument('psd_file', type=str, help='A PSD file to load the collection layers from.')

  return parser.parse_args()

def process_args() -> LoadFromPSDArgs:
  args = parse_args()
  validate_args(args)

  return args

def execute():
  args = process_args()
  psd_importer.import_psd_file(args.psd_file)

if __name__ == '__main__':
  execute()
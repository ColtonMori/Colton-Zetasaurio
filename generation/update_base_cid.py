import argparse
import base_cid_updater


class UpdateBaseCIDArgs(argparse.Namespace):
  cid: str


def validate_args(args: UpdateBaseCIDArgs):
  pass

def parse_args() -> UpdateBaseCIDArgs:
  parser = argparse.ArgumentParser('Update the base CID for the images in the metadata.')
  parser.add_argument('cid', type=str, help='A valid IPFS CID for the folder containing the items images.')

  return parser.parse_args()

def process_args() -> UpdateBaseCIDArgs:
  args = parse_args()
  validate_args(args)

  return args

def execute():
  args = process_args()
  base_cid_updater.update_base_cid(args.cid)

if __name__ == '__main__':
  execute()
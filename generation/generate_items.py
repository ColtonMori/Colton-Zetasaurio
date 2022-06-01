import argparse

import item_generator
import stats_generator

class GenerateItemsArgs(argparse.Namespace):
  amount: int

def validate_args(args: GenerateItemsArgs):
  if args.amount <= 0:
    raise ValueError('The amount of items to generate must be greater than 0.')

def parse_args() -> GenerateItemsArgs:
  parser = argparse.ArgumentParser('Generate a fixed amount of random collection items.')
  parser.add_argument('amount', type=int, help='The amount of items to generate.')

  return parser.parse_args()

def process_args() -> GenerateItemsArgs:
  args = parse_args()
  validate_args(args)

  return args

def execute():
  args = process_args()
  items = item_generator.generate_items(args.amount)
  stats_generator.plot_layers_distribution(items)

if __name__ == '__main__':
  execute()
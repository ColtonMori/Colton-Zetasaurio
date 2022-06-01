import argparse
import colorama
from os import environ
from time import sleep
from requests import get
from datetime import datetime
from dotenv import load_dotenv


def red(text):
  return colorama.Fore.RED + str(text) + colorama.Fore.RESET

def cyan(text):
  return colorama.Fore.CYAN + str(text) + colorama.Fore.RESET

def green(text):
  return colorama.Fore.GREEN + str(text) + colorama.Fore.RESET

def monitor_eth_gas_station(interval: int):
  colorama.init()
  print(f'Monitoring Eth Gas Station:')

  load_dotenv()
  INFINITE = float('inf')
  ETH_GAS_STATION_API_KEY = environ['ETH_GAS_STATION_API_KEY']
  ENDPOINT = f'https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key={ETH_GAS_STATION_API_KEY}'

  start_timestamp = datetime.today()
  best_fastest_price = INFINITE
  best_fast_price = INFINITE
  best_average_price = INFINITE
  best_safe_low_price = INFINITE

  while(True):
    timestamp = datetime.today()

    print(f'  Gathering information at [{cyan(timestamp)}]...', end='\r')

    try:
      response = get(ENDPOINT, timeout=10).json()

      fastest_price = response['fastest'] / 10
      fast_price = response['fast'] / 10
      average_price = response['average'] / 10
      safe_low_price = response['safeLow'] / 10

      best_fastest_price = min(fastest_price, best_fastest_price)
      best_fast_price = min(fast_price, best_fast_price)
      best_average_price = min(average_price, best_average_price)
      best_safe_low_price = min(safe_low_price, best_safe_low_price)

      log = (
          f'Timestamp: [{timestamp}]\n' +

          f'  Current gas prices:\n' +
          f'    fastest_price: {fastest_price} Gwei\n' +
          f'    fast_price: {fast_price} Gwei\n' +
          f'    average_price: {average_price} Gwei\n' +
          f'    safe_low_price: {safe_low_price} Gwei\n' +

          f'  Bests so far:\n' +
          f'    best_fastest_price: {best_fastest_price} Gwei\n' +
          f'    best_fast_price: {best_fast_price} Gwei\n' +
          f'    best_average_price: {best_average_price} Gwei\n' +
          f'    best_safe_low_price: {best_safe_low_price} Gwei\n\n'
      )

      with open(f'build/monitor_eth_gas_station_{start_timestamp}.log', 'a') as file_object:
        file_object.write(log)

      print(f'  Gathering information at [{cyan(timestamp)}]...' + green('Done!'))
    except:
      print(f'  Gathering information at [{cyan(timestamp)}]...' + red('Error!'))

    sleep(60 * interval)


class MonitorEthGasStationArgs(argparse.Namespace):
  interval: int


def validate_args(args: MonitorEthGasStationArgs):
  if args.interval < 1:
    raise ValueError('The monitoring interval must be at least every 1 minute.')


def parse_args() -> MonitorEthGasStationArgs:
  parser = argparse.ArgumentParser('Monitor Eth Gas Station to gather info about the best gas prices.')
  parser.add_argument('interval', type=int, help='The monitoring time interval.')

  return parser.parse_args()


def process_args() -> MonitorEthGasStationArgs:
  args = parse_args()
  validate_args(args)

  return args


def execute():
  args = process_args()
  monitor_eth_gas_station(args.interval)


if __name__ == '__main__':
  execute()

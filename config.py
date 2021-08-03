import os
import json

if 'CCOUNTER_ENV' in os.environ.keys():
  ENVIRONMENT = os.environ['CCOUNTER_ENV']
else:
  ENVIRONMENT = "local"

CONFIG = json.loads(open(f"environment.{ENVIRONMENT}.json").read())


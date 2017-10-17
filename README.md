# Financials

[Link to deployment](http://marketdata.herokuapp.com/stocks?sort=symbol&sortOrder=1)

Stock money flow data from [Wall Street Journal](http://www.wsj.com/mdc/public/page/2_3022-mfgppl-moneyflow.html)

Money flows are calculated as the dollar value of composite uptick trades minus the dollar value of downtick trades.  The up/down ratio reflects the value of uptick trades relative to the value of downtick trades.  Money flow, uptick and downtick volume are in millions of US dollars.  Percent change is calculated from the prior day 4 p.m., eastern time, closing price.

## Configuration

### Install
```bash
git clone https://github.com/mjparangot/financials

npm install
```

### Configure

Create a Mongo database on [mLab][https://mlab.com/]. Make sure to update the name of your collection in the scripts.

Update the following environment variables with your mongoDB user credentials:

`mongo_user`

`mongo_password`

### Start
`npm start`

## Usage

Get all stocks stored in the database:

`/stocks?sort=<field>&sortOrder=<sortOrder>`

- sortOrder=1 for ascending
- sortOrder=-1 for descending

Get "Buying on Weakness" money flows from WSJ and update database:

`/moneyflows/buy`

Get "Selling on Strength" money flows from WSJ and update database:

`/moneyflows/sell`

## License
The MIT License (MIT)

Copyright (c) 2016 Sahat Yalkabov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.# financials

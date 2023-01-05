/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItemEvent } from '../src/eventstreaming/item-event';
import { validateSync, ValidationError } from 'class-validator';

const ITEM_EVENT_JSON_TEMPLATE = '{"dataVersion":3,"brandCode":"brandCode1","brandName":"brandName1","brandWholesalePrice":101,"brandWholesalerShare":1.5,"claimCode":"claimCode1","dataEvent":"CREATE","dataTimestamp":"$dataTimestamp","eventId":"$eventId","itemCode":"ownershipToken1","maxQty":50,"nftAddress":"nftAddress1","nftState":"UNMINTED","ownerAddress":"ownerAddress1","platformCode":"platformCode1","retailSource":"retailSource1","retailUserId":"retailUserId1","rrp":99,"saleQty":9,"skuCode":"stockKeepingUnitCode1","skuName":"stockKeepingUnitName1","skuRarity":3,"source":"source1","state":"state1","tier":"PREMIUM_3"}'

function itemEventJson(dataTimestamp: Date, eventId: string) {
  return ITEM_EVENT_JSON_TEMPLATE
    .replace('$dataTimestamp', dataTimestamp.toISOString())
    .replace('$eventId', eventId);
}

let testEvent: ItemEvent;

describe('function - create-non-enumerated-item', () => {

  beforeEach(() => {
    testEvent = new ItemEvent();
    testEvent.brandCode = 'brandCode1';
    testEvent.brandName = 'brandName1';
    testEvent.brandWholesalePrice = 101;
    testEvent.brandWholesalerShare = 1.5;
    testEvent.claimCode = 'claimCode1';
    testEvent.dataEvent = 'CREATE';
    testEvent.dataTimestamp = new Date();
    testEvent.dataVersion = 3;
    testEvent.eventId = 'eventId';
    testEvent.itemCode = 'ownershipToken1';
    testEvent.maxQty = 50;
    testEvent.nftAddress = 'nftAddress1';
    testEvent.nftState = 'UNMINTED';
    testEvent.ownerAddress = 'ownerAddress1';
    testEvent.platformCode = 'platformCode1';
    testEvent.retailSource = 'retailSource1';
    testEvent.retailUserId = 'retailUserId1';
    testEvent.rrp = 99;
    testEvent.saleQty = 9;
    testEvent.skuCode = 'stockKeepingUnitCode1';
    testEvent.skuName = 'stockKeepingUnitName1';
    testEvent.skuRarity = 3;
    testEvent.source = 'source1';
    testEvent.state = 'state1';
    testEvent.tier = 'PREMIUM_3';
  });

  it('is valid', () => {
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('rejects unknown property', () => {
    (testEvent as any).blah = 'x';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('blah');
  });

  it('invalid dataEvent', () => {
    testEvent.dataEvent = 'X';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataEvent');
  });

  it('missing dataEvent', () => {
    delete (testEvent as any).dataEvent;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataEvent');
  });

  it('invalid dataVersion', () => {
    testEvent.dataVersion = 44;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataVersion');
  });

  it('missing dataVersion', () => {
    delete (testEvent as any).dataVersion;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataVersion');
  });

  it('invalid dataTimestamp', () => {
    (testEvent as any).dataTimestamp = 'zz';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataTimestamp');
  });

  it('missing dataTimestamp', () => {
    delete (testEvent as any).dataTimestamp;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('dataTimestamp');
  });

  it('empty retailSource', () => {
    testEvent.retailSource = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('retailSource');
  });

  it('missing retailSource', () => {
    delete (testEvent as any).retailSource;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('retailSource');
  });

  it('empty retailUserId', () => {
    testEvent.retailUserId = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('retailUserId');
  });

  it('missing retailUserId', () => {
    delete testEvent.retailUserId;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null retailUserId', () => {
    testEvent.retailUserId = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('empty itemCode', () => {
    testEvent.itemCode = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('itemCode');
  });

  it('missing itemCode', () => {
    delete (testEvent as any).itemCode;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('itemCode');
  });

  it('empty brandCode', () => {
    testEvent.brandCode = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandCode');
  });

  it('missing brandCode', () => {
    delete (testEvent as any).brandCode;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandCode');
  });

  it('empty brandName', () => {
    testEvent.brandName = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandName');
  });

  it('missing brandName', () => {
    delete (testEvent as any).brandName;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandName');
  });

  it('invalid brandWholesalePrice', () => {
    testEvent.brandWholesalePrice = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandWholesalePrice');
  });

  it('missing brandWholesalePrice', () => {
    delete testEvent.brandWholesalePrice;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null brandWholesalePrice', () => {
    testEvent.brandWholesalePrice = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('invalid brandWholesalerShare', () => {
    testEvent.brandWholesalerShare = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandWholesalerShare');
  });

  it('missing brandWholesalerShare', () => {
    delete (testEvent as any).brandWholesalerShare;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('brandWholesalerShare');
  });

  it('empty claimCode', () => {
    testEvent.claimCode = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('claimCode');
  });

  it('missing claimCode', () => {
    delete testEvent.claimCode;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null claimCode', () => {
    testEvent.claimCode = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('invalid maxQty', () => {
    testEvent.maxQty = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('maxQty');
  });

  it('missing maxQty', () => {
    delete testEvent.maxQty;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null maxQty', () => {
    testEvent.maxQty = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('empty nftAddress', () => {
    testEvent.nftAddress = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('nftAddress');
  });

  it('missing nftAddress', () => {
    delete testEvent.nftAddress;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null nftAddress', () => {
    testEvent.nftAddress = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('empty nftState', () => {
    testEvent.nftState = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('nftState');
  });

  it('missing nftState', () => {
    delete (testEvent as any).nftState;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('nftState');
  });

  it('empty ownerAddress', () => {
    testEvent.ownerAddress = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('ownerAddress');
  });

  it('missing ownerAddress', () => {
    delete testEvent.ownerAddress;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null ownerAddress', () => {
    testEvent.ownerAddress = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('empty platformCode', () => {
    testEvent.platformCode = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('platformCode');
  });

  it('missing platformCode', () => {
    delete (testEvent as any).platformCode;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('platformCode');
  });

  it('invalid rrp', () => {
    testEvent.rrp = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('rrp');
  });

  it('missing rrp', () => {
    delete testEvent.rrp;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null rrp', () => {
    testEvent.rrp = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('invalid saleQty', () => {
    testEvent.saleQty = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('saleQty');
  });

  it('missing saleQty', () => {
    delete testEvent.saleQty;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null saleQty', () => {
    testEvent.saleQty = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('empty source', () => {
    testEvent.source = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('source');
  });

  it('missing source', () => {
    delete (testEvent as any).source;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('source');
  });

  it('empty state', () => {
    testEvent.state = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('state');
  });

  it('missing state', () => {
    delete (testEvent as any).state;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('state');
  });

  it('empty skuCode', () => {
    testEvent.skuCode = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('skuCode');
  });

  it('missing skuCode', () => {
    delete (testEvent as any).skuCode;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('skuCode');
  });

  it('empty skuName', () => {
    testEvent.skuName = '';
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('skuName');
  });

  it('missing skuName', () => {
    delete (testEvent as any).skuName;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('skuName');
  });

  it('invalid skuRarity', () => {
    testEvent.skuRarity = -1;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(1);
    expect(result[0].property).toEqual('skuRarity');
  });

  it('missing skuRarity', () => {
    delete testEvent.skuRarity;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('null skuRarity', () => {
    testEvent.skuRarity = null;
    const result: ValidationError[] = validateSync(testEvent, { whitelist: true, forbidNonWhitelisted: true });
    expect(result).toHaveLength(0);
  });

  it('serializes to json', () => {
    const result = JSON.stringify(testEvent);
    expect(result).toEqual(itemEventJson(testEvent.dataTimestamp, testEvent.eventId));
  });
});

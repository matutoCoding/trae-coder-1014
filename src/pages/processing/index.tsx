import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import StatCard from '@/components/StatCard';
import ListItem from '@/components/ListItem';
import FunctionGrid from '@/components/FunctionGrid';
import { dryingRecordList, finishedProductList } from '@/data/processing';
import { harvestRecordList, harvestSummary } from '@/data/harvest';
import { processingTraceList, getInventoryQty, inventoryList } from '@/data/inventory';
import { FunctionItem } from '@/types';
import classnames from 'classnames';

type TabType = 'harvest' | 'drying' | 'product';

const ProcessingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('harvest');
  const [expandedHarvestId, setExpandedHarvestId] = useState<string | null>(null);

  const functionItems: FunctionItem[] = [
    { key: 'harvest', name: '采收登记', path: '/pages/harvest/index', bgColor: '#FFF7E6', textColor: '#FF7D00' },
    { key: 'drying', name: '晾晒加工', path: '/pages/drying/index', bgColor: '#E6F7FF', textColor: '#0077B6' },
    { key: 'package', name: '分级打包', path: '/pages/drying/index', bgColor: '#F3E8FF', textColor: '#722ED1' },
    { key: 'storage', name: '成品入库', path: '', bgColor: '#E8FBF2', textColor: '#00B42A' }
  ];

  const getTypeClass = (type: string) => {
    return type === '紫菜' ? styles.typeLaver : styles.typeKelp;
  };

  const getProcessClass = (type: string) => {
    return type === '晾晒' ? styles.processDrying : styles.processBaking;
  };

  const getGradeClass = (grade: string) => {
    switch (grade) {
      case '特级': return styles.gradeSuper;
      case '一级': return styles.gradeFirst;
      case '二级': return styles.gradeSecond;
      default: return styles.gradeSecond;
    }
  };

  const dryingStats = {
    totalInput: dryingRecordList.reduce((sum, r) => sum + r.inputQuantity, 0),
    totalOutput: dryingRecordList.reduce((sum, r) => sum + r.outputQuantity, 0),
    dryingCount: dryingRecordList.filter(r => r.processType === '晾晒').length,
    bakingCount: dryingRecordList.filter(r => r.processType === '烘干').length
  };

  const productStats = {
    totalPackages: finishedProductList.reduce((sum, p) => sum + p.packageCount, 0),
    totalWeight: finishedProductList.reduce((sum, p) => sum + p.totalWeight, 0),
    superGrade: finishedProductList.filter(p => p.grade === '特级').reduce((sum, p) => sum + p.totalWeight, 0)
  };

  const getQualityClass = (q: string) => {
    switch (q) {
      case '优': return styles.qualityExcellent;
      case '良': return styles.qualityGood;
      default: return styles.qualityNormal;
    }
  };

  const getTraceStatus = (harvestId: string) => {
    return processingTraceList.find(t => t.harvestId === harvestId);
  };

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'harvested': return { text: '已采收待加工', color: '#FF7D00', step: 1 };
      case 'drying': return { text: '晾晒/烘干中', color: '#722ED1', step: 2 };
      case 'packed': return { text: '已打包待入库', color: '#0077B6', step: 3 };
      case 'in_stock': return { text: '已入库可销售', color: '#00B42A', step: 4 };
      default: return { text: '已采收待加工', color: '#FF7D00', step: 1 };
    }
  };

  const renderHarvest = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard
          label="累计采收"
          value={harvestSummary.totalHarvest}
          unit={harvestSummary.unit}
          icon="🧺"
          bgColor="#FFF7E6"
          color="#FF7D00"
        />
        <StatCard
          label="本月采收"
          value={harvestSummary.thisMonth}
          unit="公斤"
          icon="📅"
          bgColor="#E6F7FF"
          color="#0077B6"
        />
        <StatCard
          label="加工中"
          value={processingTraceList.filter(t => t.status === 'drying').length}
          unit="批"
          icon="⚙️"
          bgColor="#F3E8FF"
          color="#722ED1"
        />
        <StatCard
          label="入库可售"
          value={inventoryList.reduce((s, i) => s + i.quantity, 0)}
          unit="公斤"
          icon="📦"
          bgColor="#E8FBF2"
          color="#00B42A"
        />
      </View>
      <SectionCard title="采收记录 · 加工追溯" subtitle={`共${harvestRecordList.length}条 · 点击卡片展开查看加工详情`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {harvestRecordList.map(record => {
            const trace = getTraceStatus(record.id);
            const statusInfo = getStatusInfo(trace?.status);
            const isExpanded = expandedHarvestId === record.id;
            const dryingRecord = trace?.dryingId ? dryingRecordList.find(d => d.id === trace.dryingId) : null;
            const productRecord = trace?.productId ? finishedProductList.find(p => p.id === trace.productId) : null;
            const stockItems = trace?.status === 'in_stock'
              ? inventoryList.filter(i => i.type === record.type)
              : [];
            return (
              <View className={styles.harvestTraceCard} key={record.id}>
                <View
                  className={styles.harvestHeader}
                  onClick={() => setExpandedHarvestId(isExpanded ? null : record.id)}
                >
                  <View className={styles.harvestTitle}>
                    <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
                    <Text className={styles.harvestArea}>{record.seaAreaName}</Text>
                  </View>
                  <View className={styles.harvestHeaderRight}>
                    <Text className={styles.harvestStatus} style={{ color: statusInfo.color }}>● {statusInfo.text}</Text>
                    <Text className={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                </View>
                <Text className={styles.harvestSubtitle}>
                  采收{record.quantity}{record.unit} · 品质{record.quality} · 操作员{record.operator} · {record.harvestDate}
                </Text>
                <View className={styles.traceSteps}>
                  <View className={styles.traceStep}>
                    <View className={classnames(styles.stepDot, styles.stepDone)}>✓</View>
                    <Text className={styles.stepText}>采收</Text>
                  </View>
                  <View className={classnames(styles.stepLine, trace && trace.status !== 'harvested' ? styles.stepLineDone : '')} />
                  <View className={styles.traceStep}>
                    <View className={classnames(styles.stepDot, trace && ['drying', 'packed', 'in_stock'].includes(trace.status) && styles.stepDone)}>
                      {trace && ['drying', 'packed', 'in_stock'].includes(trace.status) ? '✓' : '2'}
                    </View>
                    <Text className={styles.stepText}>晾晒/烘干</Text>
                  </View>
                  <View className={classnames(styles.stepLine, trace && ['packed', 'in_stock'].includes(trace.status) ? styles.stepLineDone : '')} />
                  <View className={styles.traceStep}>
                    <View className={classnames(styles.stepDot, trace && ['packed', 'in_stock'].includes(trace.status) && styles.stepDone)}>
                      {trace && ['packed', 'in_stock'].includes(trace.status) ? '✓' : '3'}
                    </View>
                    <Text className={styles.stepText}>分级打包</Text>
                  </View>
                  <View className={classnames(styles.stepLine, trace && trace.status === 'in_stock' ? styles.stepLineDone : '')} />
                  <View className={styles.traceStep}>
                    <View className={classnames(styles.stepDot, trace && trace.status === 'in_stock' && styles.stepDone)}>
                      {trace && trace.status === 'in_stock' ? '✓' : '4'}
                    </View>
                    <Text className={styles.stepText}>入库可售</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View className={styles.traceDetail}>
                    <View className={styles.traceDetailBlock}>
                      <View className={styles.traceDetailTitle}>
                        <Text className={styles.traceDetailIcon}>🧺</Text>
                        <Text className={styles.traceDetailName}>采收记录</Text>
                        <Text className={classnames(styles.traceDetailTag, styles.tagOk)}>已完成</Text>
                      </View>
                      <View className={styles.traceDetailGrid}>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>采收海区</Text>
                          <Text className={styles.detailCellValue}>{record.seaAreaName}</Text>
                        </View>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>采收量</Text>
                          <Text className={styles.detailCellValue}>{record.quantity}{record.unit}</Text>
                        </View>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>品质</Text>
                          <Text className={styles.detailCellValue}>{record.quality}</Text>
                        </View>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>操作员</Text>
                          <Text className={styles.detailCellValue}>{record.operator}</Text>
                        </View>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>采收日期</Text>
                          <Text className={styles.detailCellValue}>{record.harvestDate}</Text>
                        </View>
                        <View className={styles.detailCell}>
                          <Text className={styles.detailCellLabel}>批次备注</Text>
                          <Text className={styles.detailCellValue}>{record.remark || '-'}</Text>
                        </View>
                      </View>
                    </View>

                    {dryingRecord ? (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>☀️</Text>
                          <Text className={styles.traceDetailName}>晾晒/烘干批次</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagOk)}>已完成</Text>
                        </View>
                        <View className={styles.traceDetailGrid}>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>加工批次号</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.batchNo}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>加工方式</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.processType}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>投料量</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.inputQuantity}{dryingRecord.inputUnit}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>产出量</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.outputQuantity}{dryingRecord.outputUnit}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>产出率</Text>
                            <Text className={styles.detailCellValue}>
                              {Math.round((dryingRecord.outputQuantity / dryingRecord.inputQuantity) * 100)}%
                            </Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>操作员</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.operator}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>开始日期</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.startDate}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>完成日期</Text>
                            <Text className={styles.detailCellValue}>{dryingRecord.completeDate || '进行中'}</Text>
                          </View>
                        </View>
                      </View>
                    ) : trace && ['drying', 'packed', 'in_stock'].includes(trace.status) ? null : (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>☀️</Text>
                          <Text className={styles.traceDetailName}>晾晒/烘干批次</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagPending)}>待开始</Text>
                        </View>
                        <Text className={styles.traceDetailEmpty}>尚未进入晾晒/烘干工序</Text>
                      </View>
                    )}

                    {productRecord ? (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>📦</Text>
                          <Text className={styles.traceDetailName}>分级打包批次</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagOk)}>已完成</Text>
                        </View>
                        <View className={styles.traceDetailGrid}>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>打包批次号</Text>
                            <Text className={styles.detailCellValue}>{productRecord.batchNo}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>品类等级</Text>
                            <Text className={styles.detailCellValue}>{productRecord.type} · {productRecord.grade}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>包装规格</Text>
                            <Text className={styles.detailCellValue}>{productRecord.packageSpec}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>包装件数</Text>
                            <Text className={styles.detailCellValue}>{productRecord.packageCount}件</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>总重量</Text>
                            <Text className={styles.detailCellValue}>{productRecord.totalWeight}{productRecord.unit}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>打包日期</Text>
                            <Text className={styles.detailCellValue}>{productRecord.packageDate}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>存储库位</Text>
                            <Text className={styles.detailCellValue}>{productRecord.storageLocation}</Text>
                          </View>
                          <View className={styles.detailCell}>
                            <Text className={styles.detailCellLabel}>质检员</Text>
                            <Text className={styles.detailCellValue}>{productRecord.inspector || '-'}</Text>
                          </View>
                        </View>
                      </View>
                    ) : trace && ['packed', 'in_stock'].includes(trace.status) ? null : (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>📦</Text>
                          <Text className={styles.traceDetailName}>分级打包批次</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagPending)}>待开始</Text>
                        </View>
                        <Text className={styles.traceDetailEmpty}>尚未进入分级打包工序</Text>
                      </View>
                    )}

                    {trace?.status === 'in_stock' && stockItems.length > 0 ? (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>🏬</Text>
                          <Text className={styles.traceDetailName}>入库库存去向</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagOk)}>已入库</Text>
                        </View>
                        <View className={styles.traceStockList}>
                          {stockItems.map(item => (
                            <View className={styles.traceStockItem} key={item.id}>
                              <View className={styles.stockItemLeft}>
                                <Text className={classnames(styles.typeTag, item.type === '紫菜' ? styles.typeLaver : styles.typeKelp)}>{item.type}</Text>
                                <Text className={classnames(styles.gradeTag, getGradeClass(item.grade))}>{item.grade}</Text>
                                <Text className={styles.stockItemQty}>{item.quantity}{item.unit}</Text>
                              </View>
                              <View className={styles.stockItemRight}>
                                <Text className={styles.stockItemLoc}>📍 {item.warehouse}</Text>
                                <Text className={styles.stockItemTime}>更新：{item.updateTime}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    ) : trace?.status === 'in_stock' ? null : (
                      <View className={styles.traceDetailBlock}>
                        <View className={styles.traceDetailTitle}>
                          <Text className={styles.traceDetailIcon}>🏬</Text>
                          <Text className={styles.traceDetailName}>入库库存去向</Text>
                          <Text className={classnames(styles.traceDetailTag, styles.tagPending)}>待入库</Text>
                        </View>
                        <Text className={styles.traceDetailEmpty}>成品尚未入库</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </SectionCard>
    </>
  );

  const renderDrying = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard label="投料总量" value={dryingStats.totalInput} unit="公斤" icon="📥" bgColor="#FFF7E6" color="#FF7D00" />
        <StatCard label="产出总量" value={dryingStats.totalOutput} unit="公斤" icon="📤" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="晾晒批次" value={dryingStats.dryingCount} unit="批" icon="☀️" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="烘干批次" value={dryingStats.bakingCount} unit="批" icon="🔥" bgColor="#F3E8FF" color="#722ED1" />
      </View>
      <SectionCard title="加工记录" subtitle={`共${dryingRecordList.length}条加工记录`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {dryingRecordList.map(record => (
            <ListItem
              key={record.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
                  <Text className={classnames(styles.processTag, getProcessClass(record.processType))}>{record.processType}</Text>
                  <Text>批次 {record.batchNo}</Text>
                </View>
              }
              subtitle={`投料${record.inputQuantity}${record.inputUnit} → 产出${record.outputQuantity}${record.outputUnit}`}
              desc={`操作员:${record.operator} · ${record.remark}`}
              onClick={() => {
                console.log('[Processing] click drying record:', record.batchNo);
                Taro.navigateTo({ url: '/pages/drying/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  const renderProduct = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard label="包装总数" value={productStats.totalPackages} unit="件" icon="📦" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="成品重量" value={productStats.totalWeight} unit="公斤" icon="⚖️" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="特级品" value={productStats.superGrade} unit="公斤" icon="🏆" bgColor="#FFE4CE" color="#D46B08" />
        <StatCard label="成品批次" value={finishedProductList.length} unit="批" icon="📋" bgColor="#F3E8FF" color="#722ED1" />
      </View>
      <SectionCard title="成品库存" subtitle="可销售成品库存一览">
        <View className={styles.inventoryGrid}>
          {inventoryList.map(item => (
            <View className={styles.inventoryItem} key={item.id}>
              <View className={styles.inventoryHeader}>
                <Text className={classnames(styles.typeTag, item.type === '紫菜' ? styles.typeLaver : styles.typeKelp)}>{item.type}</Text>
                <Text className={classnames(styles.gradeTag, getGradeClass(item.grade))}>{item.grade}</Text>
              </View>
              <Text className={styles.inventoryQty}>{item.quantity}<Text className={styles.inventoryUnit}>{item.unit}</Text></Text>
              <Text className={styles.inventoryLoc}>📍 {item.warehouse}</Text>
              <Text className={styles.inventoryTime}>更新：{item.updateTime}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
      <SectionCard title="成品分级" subtitle="成品分级打包记录">
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {finishedProductList.map(product => (
            <ListItem
              key={product.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.typeTag, getTypeClass(product.type))}>{product.type}</Text>
                  <Text className={classnames(styles.gradeTag, getGradeClass(product.grade))}>{product.grade}</Text>
                  <Text>{product.batchNo}</Text>
                </View>
              }
              subtitle={`${product.packageCount}件 · ${product.packageSpec} · 共${product.totalWeight}${product.unit}`}
              desc={`打包日期:${product.packageDate} · 库位:${product.storageLocation}`}
              onClick={() => {
                console.log('[Processing] click product:', product.batchNo);
                Taro.navigateTo({ url: '/pages/drying/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="加工记录"
        subtitle="采收登记 · 晾晒烘干 · 成品打包"
      />

      <SectionCard title="快捷操作">
        <FunctionGrid items={functionItems} columns={4} />
      </SectionCard>

      <View className={styles.tabs}>
        <Text
          className={classnames(styles.tabItem, activeTab === 'harvest' && styles.tabActive)}
          onClick={() => setActiveTab('harvest')}
        >
          采收记录
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'drying' && styles.tabActive)}
          onClick={() => setActiveTab('drying')}
        >
          晾晒加工
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'product' && styles.tabActive)}
          onClick={() => setActiveTab('product')}
        >
          成品打包
        </Text>
      </View>

      {activeTab === 'harvest' && renderHarvest()}
      {activeTab === 'drying' && renderDrying()}
      {activeTab === 'product' && renderProduct()}
    </View>
  );
};

export default ProcessingPage;

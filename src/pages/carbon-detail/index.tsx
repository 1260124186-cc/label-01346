import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useCarbonStore } from '@/store/carbonStore';
import RecordItem from '@/components/RecordItem';
import { RecordCategory } from '@/types/carbon';
import { formatCO2, formatWeight } from '@/utils/carbonCalculator';

const filters: { key: RecordCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部'
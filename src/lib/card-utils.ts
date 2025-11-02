/**
 * 炉石卡牌相关的工具函数
 * 用于处理卡牌数据的映射和转换
 */

// 卡牌职业映射
export const getCardClassName = (cardClass: string, language: 'zh' | 'en' = 'zh') => {
  const classMap = {
    zh: {
      neutral: '中立',
      mage: '法师',
      warrior: '战士',
      hunter: '猎人',
      druid: '德鲁伊',
      warlock: '术士',
      priest: '牧师',
      rogue: '潜行者',
      shaman: '萨满',
      paladin: '圣骑士',
      demonhunter: '恶魔猎手',
      deathknight: '死亡骑士'
    },
    en: {
      neutral: 'Neutral',
      mage: 'Mage',
      warrior: 'Warrior',
      hunter: 'Hunter',
      druid: 'Druid',
      warlock: 'Warlock',
      priest: 'Priest',
      rogue: 'Rogue',
      shaman: 'Shaman',
      paladin: 'Paladin',
      demonhunter: 'Demon Hunter',
      deathknight: 'Death Knight'
    }
  };

  return classMap[language][cardClass as keyof typeof classMap.zh] || cardClass;
};

// 卡牌稀有度映射
export const getRarityName = (rarity: string, language: 'zh' | 'en' = 'zh') => {
  const rarityMap = {
    zh: {
      common: '普通',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    },
    en: {
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary'
    }
  };

  return rarityMap[language][rarity as keyof typeof rarityMap.zh] || rarity;
};

// 卡牌类型映射
export const getCardTypeName = (type: string, language: 'zh' | 'en' = 'zh') => {
  const typeMap = {
    zh: {
      minion: '随从',
      spell: '法术',
      weapon: '武器',
      hero: '英雄',
      hero_power: '英雄技能',
      location: '场地',
      enchantment: '附魔'
    },
    en: {
      minion: 'Minion',
      spell: 'Spell',
      weapon: 'Weapon',
      hero: 'Hero',
      hero_power: 'Hero Power',
      location: 'Location',
      enchantment: 'Enchantment'
    }
  };

  return typeMap[language][type as keyof typeof typeMap.zh] || type;
};

// 获取卡牌名称（优先显示当前语言）
export const getCardName = (nameZh: string, nameEn: string | null, language: 'zh' | 'en' = 'zh') => {
  if (language === 'en' && nameEn) {
    return nameEn;
  }
  return nameZh;
};

// 获取卡牌描述（优先显示当前语言）
export const getCardText = (textZh: string | null, textEn: string | null, language: 'zh' | 'en' = 'zh') => {
  if (language === 'en' && textEn) {
    return textEn;
  }
  return textZh;
};

/**
 * 获取用于HTML渲染的卡牌描述内容
 * 返回适合dangerouslySetInnerHTML使用的HTML字符串
 */
export const getCardTextForHTML = (language: 'zh' | 'en' = 'zh', textZh: string | null, textEn: string | null) => {
  return getCardText(textZh, textEn, language);
};
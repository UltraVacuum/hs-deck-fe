'use client';

interface FilterBuilderProps {
  filterId: string;
  value: string[];
  onChange: (value: string[]) => void;
}

const CLASS_OPTIONS = [
  { label: '法师', value: 'mage', color: 'bg-blue-500' },
  { label: '术士', value: 'warlock', color: 'bg-purple-500' },
  { label: '猎人', value: 'hunter', color: 'bg-green-500' },
  { label: '战士', value: 'warrior', color: 'bg-red-500' },
  { label: '潜行者', value: 'rogue', color: 'bg-yellow-600' },
  { label: '牧师', value: 'priest', color: 'bg-gray-500' },
  { label: '圣骑士', value: 'paladin', color: 'bg-yellow-500' },
  { label: '德鲁伊', value: 'druid', color: 'bg-orange-600' },
  { label: '萨满', value: 'shaman', color: 'bg-blue-600' },
  { label: '恶魔猎手', value: 'demonhunter', color: 'bg-purple-600' },
];

const RARITY_OPTIONS = [
  { label: '传说', value: 'legendary', color: 'bg-orange-500' },
  { label: '史诗', value: 'epic', color: 'bg-purple-500' },
  { label: '稀有', value: 'rare', color: 'bg-blue-500' },
  { label: '普通', value: 'common', color: 'bg-gray-500' },
];

export default function FilterBuilder({ filterId, value, onChange }: FilterBuilderProps) {
  const options = filterId === 'class' ? CLASS_OPTIONS : RARITY_OPTIONS;
  const selected = new Set(value || []);

  const toggleOption = (optionValue: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(optionValue)) {
      newSelected.delete(optionValue);
    } else {
      newSelected.add(optionValue);
    }
    onChange(Array.from(newSelected));
  };

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = selected.has(option.value);

        return (
          <label
            key={option.value}
            className="flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-slate-700 transition-colors"
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleOption(option.value)}
              className="w-4 h-4 text-blue-600 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex items-center space-x-2 flex-1">
              <div className={`w-3 h-3 rounded-full ${option.color}`} />
              <span className="text-white">{option.label}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
}
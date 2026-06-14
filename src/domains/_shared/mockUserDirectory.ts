import type { SearchableUser } from '@/domains/User';

export const mockSearchableUsers: SearchableUser[] = [
  { id: '1', nickname: 'Mock User', realName: '张三', avatar: '', identityType: 1 },
  { id: '2', nickname: '若水', realName: '李若水', avatar: '', identityType: 1 },
  { id: '3', nickname: 'Ming', realName: '王明轩', avatar: '', identityType: 1 },
  { id: '4', nickname: '清遥', realName: '赵清遥', avatar: '', identityType: 1 },
  { id: '5', nickname: 'Nora', realName: '陈一诺', avatar: '', identityType: 1 },
  { id: '6', nickname: '启航', realName: '周启航', avatar: '', identityType: 1 },
  { id: '7', nickname: '知微', realName: '孙知微', avatar: '', identityType: 1 },
  { id: '8', nickname: 'Star', realName: '吴星野', avatar: '', identityType: 1 },
  { id: '9', nickname: '云起', realName: '郑云起', avatar: '', identityType: 1 },
  { id: '10', nickname: '千里', realName: '冯千里', avatar: '', identityType: 1 },
  { id: '11', nickname: '秋白', realName: '蒋秋白', avatar: '', identityType: 1 },
  { id: '12', nickname: '南枝', realName: '沈南枝', avatar: '', identityType: 1 },
  { id: '13', nickname: '书言', realName: '韩书言', avatar: '', identityType: 1 },
  { id: '14', nickname: '予安', realName: '唐予安', avatar: '', identityType: 1 },
  { id: '15', nickname: '照临', realName: '何照临', avatar: '', identityType: 1 },
  { id: '16', nickname: '初夏', realName: '梁初夏', avatar: '', identityType: 1 },
  { id: '17', nickname: '见山', realName: '林见山', avatar: '', identityType: 1 },
  { id: '18', nickname: '微澜', realName: '许微澜', avatar: '', identityType: 1 },
  { id: '10001', nickname: '明明', realName: '王明', avatar: undefined, identityType: 1 },
  { id: '10002', nickname: '小林', realName: '林晓', avatar: undefined, identityType: 1 },
  { id: '10003', nickname: 'Potassium', realName: '陈钾', avatar: undefined, identityType: 2 },
  { id: '10004', nickname: 'NianLe', realName: '年乐', avatar: undefined, identityType: 2 },
  { id: '10005', nickname: 'Lonelycat', realName: '孤猫', avatar: undefined, identityType: 2 },
];

export const mockGroupUserIds: Record<string, string[]> = {
  '1': Array.from({ length: 18 }, (_, index) => String(index + 1)),
  '2': ['1', '4', '5', '8', '10', '12', '14', '16', '18', '10003', '10004', '10005'],
};

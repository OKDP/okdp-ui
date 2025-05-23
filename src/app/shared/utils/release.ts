export interface Parameter {
    name: string;
    value: any;
}

export function deflateParameters(params: Parameter[]): Record<string, any> {
    const result: Record<string, any> = {};
  
    for (const param of params) {
      if (!param.name || param.value === undefined || param.value === null) continue;
  
      const keys = param.name.split('.');
      let currentLevel = result;
  
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
  
        if (i === keys.length - 1) {
          currentLevel[key] = param.value;
        } else {
          if (typeof currentLevel[key] !== 'object' || currentLevel[key] === null) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }
      }
    }
  
    return result;
  }

import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  passWithNoTests: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!(tsx-vanilla)/)'],
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest',
  },
};

export default config;

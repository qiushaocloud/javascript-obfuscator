import { assert } from 'chai';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as rimraf from 'rimraf';

import { ObfuscatedCodeWriter } from '../../../../src/cli/utils/ObfuscatedCodeWriter';

const isWin32: boolean = process.platform === 'win32';

describe('ObfuscatedCodeWriter', () => {
    const tmpDirectoryPath: string = 'test/tmp';

    describe('getOutputCodePath', () => {
        before(() => {
            mkdirp.sync(path.join(tmpDirectoryPath, 'input', 'nested',));
            fs.writeFileSync(
                path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js'),
                'var foo = 1;'
            );
        });

        describe('Variant #1: raw input path is a file path, raw output path is a file path', () => {
            const inputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const expectedOutputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');

            let outputCodePath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputCodePath = obfuscatedCodeWriter.getOutputCodePath(inputPath);
            });

            it('should return output path that equals to passed output file path', () => {
                assert.equal(outputCodePath, expectedOutputCodePath);
            });
        });

        describe('Variant #2: raw input path is a file path, raw output path is a directory path', () => {
            const inputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output');
            const expectedOutputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-input.js');

            let outputCodePath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputCodePath = obfuscatedCodeWriter.getOutputCodePath(inputPath);
            });

            it('should return output path that equals to passed output directory with file name from actual file path', () => {
                assert.equal(outputCodePath, expectedOutputCodePath);
            });
        });

        describe('Variant #3: raw input path is a directory path, raw output path is a file path', () => {
            const inputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');

            let testFunc: () => string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                testFunc = () => obfuscatedCodeWriter.getOutputCodePath(inputPath);
            });

            it('should throw an error if output path is a file path', () => {
                assert.throws(testFunc, Error);
            });
        });

        describe('Variant #4: raw input path is a directory path, raw output path is a directory path', () => {
            describe('Variant #1: base directory name', () => {
                const inputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
                const rawInputPath: string = path.join(tmpDirectoryPath, 'input');
                const rawOutputPath: string = path.join(tmpDirectoryPath, 'output');
                const expectedOutputCodePath: string = path.join(
                    tmpDirectoryPath,
                    'output',
                    'nested',
                    'test-input.js'
                );

                let outputCodePath: string;

                before(() => {
                    const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                        rawInputPath,
                        {
                            output: rawOutputPath
                        }
                    );
                    outputCodePath = obfuscatedCodeWriter.getOutputCodePath(inputPath);
                });

                it('should return output path that contains raw output path and actual file input path', () => {
                    assert.equal(outputCodePath, expectedOutputCodePath);
                });
            });

            describe('Variant #2: directory name with dot', () => {
                const inputPath: string = path.join(tmpDirectoryPath, 'input', 'nested', 'test-input.js');
                const rawInputPath: string = path.join(tmpDirectoryPath, 'input');
                const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'foo.bar');
                const expectedOutputCodePath: string = path.join(
                    tmpDirectoryPath,
                    'output',
                    'foo.bar',
                    'nested',
                    'test-input.js'
                );

                let outputCodePath: string;

                before(() => {
                    const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                        rawInputPath,
                        {
                            output: rawOutputPath
                        }
                    );
                    outputCodePath = obfuscatedCodeWriter.getOutputCodePath(inputPath);
                });

                it('should return output path that contains raw output path and actual file input path', () => {
                    assert.equal(outputCodePath, expectedOutputCodePath);
                });
            });
        });

        if (isWin32) {
            const baseDirnamePath: string = __dirname;

            before(() => {
                mkdirp.sync(path.join(baseDirnamePath, tmpDirectoryPath, 'input', 'nested'));
                fs.writeFileSync(
                    path.join(baseDirnamePath, tmpDirectoryPath, 'input', 'nested', 'test-input.js'),
                    'var foo = 1;'
                );
            });

            describe('Win32 tests', () => {
                describe('Variant #1: raw input absolute path is a directory path, raw output absolute path is a directory path', () => {
                    describe('Variant #1: base directory name', () => {
                        const inputPath: string = path.join(baseDirnamePath, tmpDirectoryPath, 'input', 'nested', 'test-input.js');
                        const rawInputPath: string = path.join(baseDirnamePath, tmpDirectoryPath, 'input');
                        const rawOutputPath: string = path.join(baseDirnamePath, tmpDirectoryPath, 'output');
                        const expectedOutputCodePath: string = path.join(
                            baseDirnamePath,
                            tmpDirectoryPath,
                            'output',
                            'nested',
                            'test-input.js'
                        );

                        let outputCodePath: string;

                        before(() => {
                            const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                                rawInputPath,
                                {
                                    output: rawOutputPath
                                }
                            );
                            outputCodePath = obfuscatedCodeWriter.getOutputCodePath(inputPath);
                        });

                        it('should return output path that contains raw output path and actual file input path', () => {
                            assert.equal(outputCodePath, expectedOutputCodePath);
                        });
                    });
                });
            });

            after(() => {
                rimraf.sync(path.join(baseDirnamePath, tmpDirectoryPath));
            });
        }

        after(() => {
            rimraf.sync(tmpDirectoryPath);
        });
    });

    describe('getOutputSourceMapPath', () => {
        describe('Variant #1: output code path is set', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #2: output code path with dot', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input.with.dot', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output.with.dot', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output.with.dot', 'test-output.js');
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output.with.dot', 'test-output.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #3: source map file name without extension is set', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const sourceMapFileName: string = 'foo';
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output', 'foo.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath, sourceMapFileName);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #4: source map file name with wrong extension is set', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const sourceMapFileName: string = 'foo.js';
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output', 'foo.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath, sourceMapFileName);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #5: source map file name with valid extension is set', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const sourceMapFileName: string = 'foo.js.map';
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output', 'foo.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath, sourceMapFileName);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #6: source map file name is a path', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const outputCodePath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');
            const sourceMapFileName: string = path.join('parent', 'foo.js.map');
            const expectedOutputSourceMapPath: string = path.join(tmpDirectoryPath, 'output', 'parent', 'foo.js.map');

            let outputSourceMapPath: string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                outputSourceMapPath = obfuscatedCodeWriter.getOutputSourceMapPath(outputCodePath, sourceMapFileName);
            });

            it('should return output path for source map', () => {
                assert.equal(outputSourceMapPath, expectedOutputSourceMapPath);
            });
        });

        describe('Variant #7: empty paths', () => {
            const rawInputPath: string = path.join(tmpDirectoryPath, 'input', 'test-input.js');
            const rawOutputPath: string = path.join(tmpDirectoryPath, 'output', 'test-output.js');

            let testFunc: () => string;

            before(() => {
                const obfuscatedCodeWriter: ObfuscatedCodeWriter = new ObfuscatedCodeWriter(
                    rawInputPath,
                    {
                        output: rawOutputPath
                    }
                );
                testFunc = () => obfuscatedCodeWriter.getOutputSourceMapPath('', '');
            });

            it('should throw an error if output code path is empty', () => {
                assert.throws(testFunc, Error);
            });
        });
    });
});

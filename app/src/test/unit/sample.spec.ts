/**
 * ============================================================
 * Jest 単体テストの書き方サンプル集
 * ============================================================
 *
 * このファイルでは、Jestを使った単体テストの様々なパターンを紹介します。
 * 自分の実装した処理をテストする際の参考にしてください。
 *
 * 【単体テストの基本】
 * - describe(): テストをグループ化する
 * - it() または test(): 1つのテストケースを定義する
 * - expect(): テスト対象の値を検証する
 *
 * 【テストを書くときのポイント】
 * - 1つのテストケース = 1つの動作確認
 * - 「正常系」と「異常系」を分けて書く
 * - テスト名は「〜すること」「〜の場合」など日本語でわかりやすく
 */

// ============================================================
// テスト対象の関数群（実際のプロジェクトでは別ファイルからimportする）
// ============================================================

/** 2つの数値を足し算する */
const addNumbers = (a: number, b: number): number => {
  return a + b;
};

/** 2つの数値を引き算する */
const subtractNumbers = (a: number, b: number): number => {
  return a - b;
};

/** 数値が正の数かどうかを判定する */
const isPositive = (num: number): boolean => {
  return num > 0;
};

/** 数値が偶数かどうかを判定する */
const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

/** 文字列が空かどうかを判定する */
const isEmpty = (str: string): boolean => {
  return str.length === 0;
};

/** 配列の合計値を計算する */
const sumArray = (numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

/** 配列から偶数だけを抽出する */
const filterEvenNumbers = (numbers: number[]): number[] => {
  return numbers.filter((num) => num % 2 === 0);
};

/** ユーザー情報を作成する */
const createUser = (
  name: string,
  age: number
): { name: string; age: number; isAdult: boolean } => {
  return {
    name,
    age,
    isAdult: age >= 18,
  };
};

/** 名前からあいさつ文を作成する（nullの場合は「ゲスト」を使用） */
const greet = (name: string | null): string => {
  if (name === null) {
    return "こんにちは、ゲストさん！";
  }
  return `こんにちは、${name}さん！`;
};

/** 0で割り算しようとするとエラーを投げる */
const divideNumbers = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error("0で割ることはできません");
  }
  return a / b;
};

/** 年齢からカテゴリを判定する */
const getAgeCategory = (age: number): string => {
  if (age < 0) {
    throw new Error("年齢は0以上である必要があります");
  }
  if (age < 13) return "子供";
  if (age < 20) return "ティーン";
  if (age < 65) return "大人";
  return "シニア";
};

// ============================================================
// テストコード
// ============================================================

/**
 * ------------------------------------------------------------
 * パターン1: 基本的なテスト
 * ------------------------------------------------------------
 * 最もシンプルなテストの形式です。
 * describe()でグループ化し、it()で個別のテストケースを書きます。
 */
describe("【パターン1】基本的なテスト", () => {
  describe("addNumbers関数", () => {
    it("2つの数字を足すことができる", () => {
      // 関数を実行
      const result = addNumbers(1, 2);

      // 結果を検証（expect: 期待する, toBe: 〜であること）
      expect(result).toBe(3);
    });

    it("負の数を足すことができる", () => {
      const result = addNumbers(5, -3);
      expect(result).toBe(2);
    });

    it("0を足しても値が変わらない", () => {
      const result = addNumbers(10, 0);
      expect(result).toBe(10);
    });
  });

  describe("subtractNumbers関数", () => {
    it("2つの数字を引くことができる", () => {
      const result = subtractNumbers(5, 3);
      expect(result).toBe(2);
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン2: 真偽値（true/false）のテスト
 * ------------------------------------------------------------
 * boolean を返す関数のテスト方法です。
 * toBe(true), toBe(false), toBeTruthy(), toBeFalsy() が使えます。
 */
describe("【パターン2】真偽値のテスト", () => {
  describe("isPositive関数", () => {
    it("正の数の場合はtrueを返す", () => {
      expect(isPositive(5)).toBe(true);
    });

    it("負の数の場合はfalseを返す", () => {
      expect(isPositive(-5)).toBe(false);
    });

    it("0の場合はfalseを返す", () => {
      expect(isPositive(0)).toBe(false);
    });
  });

  describe("isEven関数", () => {
    it("偶数の場合はtrueを返す", () => {
      // toBeTruthy() は「真っぽい値」（true, 1, "hello" など）をチェック
      expect(isEven(4)).toBeTruthy();
    });

    it("奇数の場合はfalseを返す", () => {
      // toBeFalsy() は「偽っぽい値」（false, 0, "", null, undefined など）をチェック
      expect(isEven(3)).toBeFalsy();
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン3: 文字列のテスト
 * ------------------------------------------------------------
 * 文字列を検証するテスト方法です。
 * toBe(), toContain(), toMatch() などが使えます。
 */
describe("【パターン3】文字列のテスト", () => {
  describe("greet関数", () => {
    it("名前を渡すとあいさつ文を返す", () => {
      const result = greet("田中");

      // 完全一致のチェック
      expect(result).toBe("こんにちは、田中さん！");
    });

    it("名前がnullの場合はゲストとしてあいさつする", () => {
      const result = greet(null);
      expect(result).toBe("こんにちは、ゲストさん！");
    });

    it("あいさつ文に「こんにちは」が含まれる", () => {
      const result = greet("山田");

      // 部分一致のチェック（文字列が含まれているか）
      expect(result).toContain("こんにちは");
    });

    it("あいさつ文が正しい形式になっている", () => {
      const result = greet("佐藤");

      // 正規表現でのチェック（パターンに一致するか）
      expect(result).toMatch(/こんにちは、.+さん！/);
    });
  });

  describe("isEmpty関数", () => {
    it("空文字列の場合はtrueを返す", () => {
      expect(isEmpty("")).toBe(true);
    });

    it("文字がある場合はfalseを返す", () => {
      expect(isEmpty("hello")).toBe(false);
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン4: 配列のテスト
 * ------------------------------------------------------------
 * 配列を検証するテスト方法です。
 * toHaveLength(), toContain(), toEqual() などが使えます。
 */
describe("【パターン4】配列のテスト", () => {
  describe("filterEvenNumbers関数", () => {
    it("偶数だけを抽出できる", () => {
      const result = filterEvenNumbers([1, 2, 3, 4, 5, 6]);

      // 配列の長さをチェック
      expect(result).toHaveLength(3);

      // 配列が特定の値を含むかチェック
      expect(result).toContain(2);
      expect(result).toContain(4);
      expect(result).toContain(6);

      // 配列全体の内容をチェック（順序も含めて完全一致）
      expect(result).toEqual([2, 4, 6]);
    });

    it("偶数のみの場合はその配列を返す", () => {
      const result = filterEvenNumbers([2, 4, 6]);
      expect(result).toEqual([2, 4, 6]);
    });

    it("偶数がない場合は空の配列を返す", () => {
      const result = filterEvenNumbers([1, 3, 5]);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("空の配列を渡すと空の配列を返す", () => {
      const result = filterEvenNumbers([]);
      expect(result).toEqual([]);
    });
  });

  describe("sumArray関数", () => {
    it("配列の合計値を計算できる", () => {
      expect(sumArray([1, 2, 3, 4, 5])).toBe(15);
    });

    it("空の配列の場合は0を返す", () => {
      expect(sumArray([])).toBe(0);
    });

    it("1つの要素しかない場合はその値を返す", () => {
      expect(sumArray([42])).toBe(42);
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン5: オブジェクトのテスト
 * ------------------------------------------------------------
 * オブジェクトを検証するテスト方法です。
 * オブジェクトについての参考記事: https://typescriptbook.jp/reference/values-types-variables/object
 *
 * toEqual(), toMatchObject() などが使えます。
 *
 * 【注意】オブジェクトの比較には toBe() ではなく toEqual() を使う！
 * - toBe(): 同じ参照（同じメモリ上のオブジェクト）かをチェック
 * - toEqual(): 中身の値が同じかをチェック
 */
describe("【パターン5】オブジェクトのテスト", () => {
  describe("createUser関数", () => {
    it("ユーザー情報を作成できる", () => {
      const result = createUser("田中太郎", 25);

      // オブジェクト全体が一致するかチェック
      expect(result).toEqual({
        name: "田中太郎",
        age: 25,
        isAdult: true,
      });
    });

    it("18歳以上は成人として扱う", () => {
      const result = createUser("山田花子", 18);

      // オブジェクトの一部だけをチェック（他のプロパティは無視）
      expect(result).toMatchObject({
        isAdult: true,
      });
    });

    it("18歳未満は未成年として扱う", () => {
      const result = createUser("佐藤一郎", 17);

      expect(result).toMatchObject({
        isAdult: false,
      });
    });

    it("特定のプロパティが存在することをチェック", () => {
      const result = createUser("鈴木二郎", 30);

      // プロパティが定義されているかチェック
      expect(result.name).toBeDefined();
      expect(result.age).toBeDefined();
      expect(result.isAdult).toBeDefined();
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン6: 例外（エラー）のテスト
 * ------------------------------------------------------------
 * 関数がエラーを投げることをテストする方法です。
 * toThrow() を使います。
 *
 * 【重要】toThrow() を使う場合、expect() に関数の「実行結果」ではなく
 * 「関数自体」を渡す必要があります。そのためアロー関数で包みます。
 */
describe("【パターン6】例外のテスト", () => {
  describe("divideNumbers関数", () => {
    it("正常に割り算できる", () => {
      expect(divideNumbers(10, 2)).toBe(5);
    });

    it("0で割ろうとするとエラーを投げる", () => {
      // エラーが発生することをテスト
      // NG: expect(divideNumbers(10, 0)).toThrow() ← これは動かない
      // OK: expect(() => divideNumbers(10, 0)).toThrow() ← 関数で包む
      expect(() => divideNumbers(10, 0)).toThrow();
    });

    it("エラーメッセージが正しいことを確認", () => {
      // エラーメッセージの内容もチェックできる
      expect(() => divideNumbers(10, 0)).toThrow("0で割ることはできません");
    });
  });

  describe("getAgeCategory関数", () => {
    it("負の年齢を渡すとエラーを投げる", () => {
      expect(() => getAgeCategory(-1)).toThrow(
        "年齢は0以上である必要があります"
      );
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン7: null / undefined のテスト
 * ------------------------------------------------------------
 * 値が null や undefined かどうかをテストする方法です。
 */
describe("【パターン7】null / undefined のテスト", () => {
  describe("nullやundefinedの判定", () => {
    it("toBeNull(): nullであることを確認", () => {
      const value = null;
      expect(value).toBeNull();
    });

    it("toBeUndefined(): undefinedであることを確認", () => {
      const obj: { name?: string } = {};
      expect(obj.name).toBeUndefined();
    });

    it("toBeDefined(): undefined以外の値であることを確認", () => {
      const value = "hello";
      expect(value).toBeDefined();
    });

    it("not.toBeNull(): nullでないことを確認", () => {
      const value = "hello";
      // not を使うと「〜ではない」という検証ができる
      expect(value).not.toBeNull();
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン8: 複数のテストケースをまとめて書く（テーブルドリブンテスト）
 * ------------------------------------------------------------
 * 同じ関数を複数のパターンでテストしたい場合、it.each() を使うと便利です。
 * テストデータをテーブル形式で定義できます。
 */
describe("【パターン8】テーブルドリブンテスト（it.each）", () => {
  describe("getAgeCategory関数", () => {
    // テストケースを配列で定義
    it.each([
      { age: 0, expected: "子供" },
      { age: 12, expected: "子供" },
      { age: 13, expected: "ティーン" },
      { age: 19, expected: "ティーン" },
      { age: 20, expected: "大人" },
      { age: 64, expected: "大人" },
      { age: 65, expected: "シニア" },
      { age: 100, expected: "シニア" },
    ])("年齢が$ageの場合は「$expected」を返す", ({ age, expected }) => {
      expect(getAgeCategory(age)).toBe(expected);
    });
  });

  describe("isEven関数", () => {
    // シンプルな配列形式でも書ける
    it.each([
      [0, true],
      [2, true],
      [4, true],
      [1, false],
      [3, false],
      [5, false],
    ])("数値 %i は偶数=%s", (num, expected) => {
      expect(isEven(num)).toBe(expected);
    });
  });
});

/**
 * ------------------------------------------------------------
 * パターン9: beforeEach / afterEach を使ったセットアップ
 * ------------------------------------------------------------
 * 各テストの前後に共通の処理を実行したい場合に使います。
 * - beforeEach: 各テストの「前」に実行される
 * - afterEach: 各テストの「後」に実行される
 * - beforeAll: 全テストの「前」に1回だけ実行される
 * - afterAll: 全テストの「後」に1回だけ実行される
 */
describe("【パターン9】beforeEach / afterEach を使ったテスト", () => {
  // 各テストで使う変数を宣言
  let numbers: number[];

  // 各テストの前に実行される
  beforeEach(() => {
    // テストデータを初期化
    numbers = [1, 2, 3, 4, 5];
  });

  // 各テストの後に実行される（この例では特に必要ないが、クリーンアップに使う）
  afterEach(() => {
    // 配列をクリア
    numbers = [];
  });

  it("配列に要素を追加できる", () => {
    numbers.push(6);
    expect(numbers).toHaveLength(6);
    expect(numbers).toContain(6);
  });

  it("配列から要素を削除できる", () => {
    numbers.pop();
    expect(numbers).toHaveLength(4);
    expect(numbers).not.toContain(5);
  });

  it("各テストは独立している（前のテストの影響を受けない）", () => {
    // beforeEach で毎回 [1, 2, 3, 4, 5] に初期化されるので
    // 前のテストで push や pop しても影響を受けない
    expect(numbers).toHaveLength(5);
    expect(numbers).toEqual([1, 2, 3, 4, 5]);
  });
});

/**
 * ------------------------------------------------------------
 * パターン10: describeのネスト（階層化）
 * ------------------------------------------------------------
 * テストを階層的に整理することで、読みやすくなります。
 * 「何の」「どんな条件で」「どうなるか」を明確にします。
 */
describe("【パターン10】describeのネスト", () => {
  describe("getAgeCategory関数", () => {
    // 正常系のテスト
    describe("正常系", () => {
      describe("子供の場合", () => {
        it("0歳は子供", () => {
          expect(getAgeCategory(0)).toBe("子供");
        });

        it("12歳は子供", () => {
          expect(getAgeCategory(12)).toBe("子供");
        });
      });

      describe("ティーンの場合", () => {
        it("13歳はティーン", () => {
          expect(getAgeCategory(13)).toBe("ティーン");
        });

        it("19歳はティーン", () => {
          expect(getAgeCategory(19)).toBe("ティーン");
        });
      });
    });

    // 異常系のテスト
    describe("異常系", () => {
      it("負の年齢はエラー", () => {
        expect(() => getAgeCategory(-1)).toThrow();
      });
    });

    // 境界値のテスト
    describe("境界値", () => {
      it("12歳は子供、13歳はティーン（境界）", () => {
        expect(getAgeCategory(12)).toBe("子供");
        expect(getAgeCategory(13)).toBe("ティーン");
      });

      it("19歳はティーン、20歳は大人（境界）", () => {
        expect(getAgeCategory(19)).toBe("ティーン");
        expect(getAgeCategory(20)).toBe("大人");
      });
    });
  });
});

/**
 * ============================================================
 * 【補足】よく使うマッチャーまとめ
 * ============================================================
 *
 * ■ 等価性
 * - toBe(value)        : 厳密等価（===）でチェック。プリミティブ値向け
 * - toEqual(value)     : 値の内容でチェック。配列やオブジェクト向け
 *
 * ■ 真偽値
 * - toBeTruthy()       : 真っぽい値（true, 1, "hello" など）
 * - toBeFalsy()        : 偽っぽい値（false, 0, "", null, undefined など）
 * - toBeNull()         : null
 * - toBeUndefined()    : undefined
 * - toBeDefined()      : undefined以外
 *
 * ■ 数値
 * - toBeGreaterThan(n)     : n より大きい
 * - toBeGreaterThanOrEqual(n) : n 以上
 * - toBeLessThan(n)        : n より小さい
 * - toBeLessThanOrEqual(n) : n 以下
 * - toBeCloseTo(n)         : 浮動小数点の近似値（0.1 + 0.2 ≈ 0.3 のチェックに使う）
 *
 * ■ 文字列
 * - toContain(str)     : 文字列が含まれている
 * - toMatch(regexp)    : 正規表現にマッチする
 *
 * ■ 配列
 * - toHaveLength(n)    : 配列の長さが n
 * - toContain(item)    : 配列に item が含まれている
 *
 * ■ オブジェクト
 * - toMatchObject(obj) : オブジェクトが obj の内容を含む（部分一致）
 *
 * ■ 例外
 * - toThrow()          : エラーを投げる
 * - toThrow(message)   : 指定メッセージのエラーを投げる
 *
 * ■ 否定
 * - not.toBe(value)    : 「〜ではない」をチェック（他のマッチャーにも使える）
 */

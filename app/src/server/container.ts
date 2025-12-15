/**
 * DIコンテナ
 * 依存関係の注入を管理する
 */

type Factory<T> = () => T;

/**
 * トークンの型定義
 * クラスコンストラクタをトークンとして使用する場合、型推論が正しく機能するように定義
 *
 * 注意: クラスコンストラクタの引数の型は様々なため、any[]を使用しています。
 * これは型安全性のトレードオフですが、register/resolve時の型チェックにより
 * 実用的な型安全性を確保しています。
 */
type Token<T = unknown> =
  | string
  | symbol
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (abstract new (...args: any[]) => T);

/**
 * 型マップ：トークンとインスタンス型の対応を管理
 */
type TypeMap = Map<Token, unknown>;

class Container {
  private instances: TypeMap = new Map();
  private factories = new Map<Token, Factory<unknown>>();

  /**
   * シングルトンインスタンスを登録
   * @param token トークン（クラスコンストラクタ）
   * @param factory インスタンスを生成するファクトリー関数
   * @template T インスタンスの型（トークンから自動推論される）
   */
  register<T>(token: Token<T>, factory: Factory<T>): void {
    // 型チェック：ファクトリー関数の戻り値の型がトークンの型と一致することを確認
    this.factories.set(token, factory as Factory<unknown>);
  }

  /**
   * インスタンスを解決（取得）
   * @param token トークン（クラスコンストラクタ）
   * @returns インスタンス
   * @template T インスタンスの型（トークンから自動推論される）
   * @throws {Error} トークンが登録されていない場合
   */
  resolve<T>(token: Token<T>): T {
    // 既にインスタンスが存在する場合はそれを返す（シングルトン）
    const existingInstance = this.instances.get(token);
    if (existingInstance !== undefined) {
      // 型アサーションは必要だが、登録時に型チェックが行われているため安全
      return existingInstance as T;
    }

    // ファクトリー関数が登録されている場合は実行
    const factory = this.factories.get(token);
    if (!factory) {
      const tokenName =
        typeof token === "string"
          ? token
          : typeof token === "symbol"
            ? token.toString()
            : token.name || "Unknown";
      throw new Error(
        `No registration found for token: ${tokenName}. Please register a factory function using container.register().`
      );
    }

    // ファクトリー関数を実行してインスタンスを生成
    const instance = factory() as T;
    this.instances.set(token, instance);
    return instance;
  }

  /**
   * 登録をクリア（テスト用）
   */
  clear(): void {
    this.instances.clear();
    this.factories.clear();
  }

  /**
   * トークンが登録されているか確認
   * @param token トークン
   * @returns 登録されている場合true
   */
  isRegistered<T>(token: Token<T>): boolean {
    return this.factories.has(token);
  }
}

// シングルトンインスタンス
export const container = new Container();

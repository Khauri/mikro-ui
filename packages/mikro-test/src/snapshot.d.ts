export declare function trySnapshot(dir: string, file: string, runner: (utils: {
    title(title: string): void;
    snapshot(ext: string, data: unknown): Promise<void>;
}) => Promise<void>): Promise<void>;
export declare function trackError(err: string | Error): void;

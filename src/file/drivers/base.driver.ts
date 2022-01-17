import fetch from "node-fetch";

import { Logger } from "@nestjs/common";

import { File } from "@file/models/file.model";

export abstract class BaseDriver {
    protected static readonly logger = new Logger(BaseDriver.name);

    public static getFileName(file: File, thumbnail = false) {
        return `${file.uploadedTimestamp}${thumbnail ? "s.jpg" : file.extension}`;
    }
    public static getFileUrl(file: File, thumbnail = false) {
        return `https://i.4cdn.org/${file.boardId}/${BaseDriver.getFileName(file, thumbnail)}`;
    }
    public static async downloadFile(file: File, thumbnail = false): Promise<Buffer> {
        return BaseDriver.downloadBuffer(BaseDriver.getFileUrl(file, thumbnail));
    }
    public static async downloadBuffer(url: string): Promise<Buffer> {
        return fetch(url).then(res => res.buffer());
    }

    public abstract initialize(): Promise<void>;
    public abstract exists(file: File): Promise<boolean>;
    public abstract push(file: File): Promise<void>;
    public abstract pull(file: File, thumbnail?: boolean): Promise<string | Buffer>;
}

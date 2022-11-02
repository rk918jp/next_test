import pino from 'pino'

export const logger = pino({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: {
        targets: [
            // ファイル出力
            {
                target: 'pino/file',
                options: {
                    destination: "logs/out.log",
                    mkdir:true,
                },
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            },
            // コンソール
            {
                target: "pino-pretty",
                options: {},
                level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
            }
        ],
    },
})
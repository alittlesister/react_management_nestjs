CREATE TABLE `fd_user` (
    `username` varchar(255) DEFAULT NULL COMMENT '登录名',
    `password` varchar(255) DEFAULT NULL COMMENT '密码Hash',
    `nickname` varchar(255) DEFAULT NULL COMMENT '用户昵称/真实名称',
    `role_ids` varchar(255) DEFAULT NULL COMMENT '角色ID列表',
    `status` tinyint(1) DEFAULT NULL COMMENT '状态 0:禁用 1:启用',
    `email` varchar(255) NOT NULL COMMENT '邮箱',
    `phone` varchar(255) DEFAULT NULL COMMENT '手机号',
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户唯一标志id',
    `create_by` varchar(255) DEFAULT NULL,
    `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
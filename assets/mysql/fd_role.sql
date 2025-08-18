CREATE TABLE `fd_role` (
    `name` varchar(255) DEFAULT NULL COMMENT '角色名称',
    `status` tinyint(1) DEFAULT NULL COMMENT '状态 0:禁用 1:启用',
    `permission_ids` varchar(255) DEFAULT NULL COMMENT '权限ID列表',
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '角色唯一标志id',
    `create_by` varchar(255) DEFAULT NULL,
    `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
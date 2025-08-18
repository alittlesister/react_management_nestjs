CREATE TABLE `fd_permission` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '权限唯一标志id',
    `name` varchar(255) DEFAULT NULL COMMENT '权限名称',
    `type` tinyint(1) DEFAULT NULL COMMENT '类型 0:菜单 1:按钮 2:接口',
    `status` tinyint(1) DEFAULT NULL COMMENT '状态 0:禁用 1:启用',
    `parent_id` int unsigned DEFAULT NULL COMMENT '父级ID',
    `path` varchar(255) DEFAULT NULL COMMENT '路径',
    `component` varchar(255) DEFAULT NULL COMMENT '组件',
    `icon` varchar(255) DEFAULT NULL COMMENT '图标',
    `create_by` varchar(255) DEFAULT NULL,
    `create_time` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
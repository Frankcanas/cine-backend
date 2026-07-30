// app/src/models/membership.model.ts

import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
    tableName: "memberships",
    timestamps: true,
})

export class Membership extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    durationDays!: number;
    
    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    description!: string;
}

export default Membership;
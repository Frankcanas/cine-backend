//app/src/dto/create.membreship.dto.ts


export interface CreateMembershipDto {

    name: string;
    price: number;
    durationDays: number;
    description: string;
    level?: string;
    discountPercentage?: number;
    pointsPerPurchase?: number;

}





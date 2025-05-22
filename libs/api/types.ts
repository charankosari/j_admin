import { TableStatus } from "@/components/real-time/table-grid";

export interface IUser {
	id: string;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone_number: string;
    profile_picture: string;
    points: number;
    phone_otp: string;
    email_otp: string;
    role: string;
    is_email_verified: boolean;
    is_mobile_verified: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface IAssistance {

    id: string;
    
    table_number: string;
    
    user_id: string;
    
    created_at: Date;
    
    }
export interface IDishCategory {
    id: string;
    name: string;
    picture: string;
    created_at: Date;
    updated_at: Date;
}

export interface IDish {
    id: string;
    name: string;
    price: number;
    picture: string;
    dish_category_id: string;
    is_available: boolean;
    is_non_veg: boolean;
    meta_data: object;
    created_at: Date;
    updated_at: Date;
}

export interface IDineInCheckout {
    id: string;
    user_id: string;
    booking_id: string;
    table_id: string;
    order_ids: string[];
    total_price: number;
    payment_status: string;
    payment_date: Date;
    is_checked_out: boolean;
    created_at: Date;
    updated_at: Date;
}

interface IOrderItem {
    dish_id: string;
    quantity: number;
    instructions?: string;
    item_status?: "pending" | "preparing" | "served" | "ready";
    status?: string;

}

export interface IDineInOrder {
    id: string;
    booking_id: string;
    user_id: string;
    table_id: string;
    items: IOrderItem[];
    is_served: boolean;
    order_status: string;
    is_paid: boolean; // Add this line
    created_at: Date;
    updated_at: Date;
}

export interface IBanner {
    id: string;
    image: string;
    name?: string;
  }

export interface IDineInTableBooking {
    id: string;
    table_id: string;
    user_id: string;
    booking_date: Date;
    booking_time: Date;
    from_time: Date;
    to_time?: Date;
    number_of_people?: number;
    is_confirmed: boolean;
    is_cancelled: boolean;
    is_completed: boolean;
    is_ready_to_bill:boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IDineInTable {
    id: string;
    table_number: string;
    is_available: boolean;
    capacity: number;
    meta_data: {
      status: TableStatus;
      qr_code: string;
      to_be_cleaned: boolean; 
    };
    created_at: Date;
    updated_at: Date;
}

export interface IReview {
	id: string;
    user_id: string;
    product_id: string;
    dish_id: string;
    rating: number;
    comment: string;
    meta_data: string;
    created_at: Date;
    updated_at: Date;
}

interface ProductSale {
    id: string;
    name: string;
    count: number;
  }
  
  interface CategorySale {
    category: {
      id: string;
      name: string;
    };
    dishes: ProductSale[];
  }
  
  interface PeakHourData {
    [date: string]: {
      [hour: string]: number;
    };
  }
  
  interface RevenueData {
    [date: string]: number;
  }
  
  export interface IAllStats {
    success: boolean;
    data: {
      date: string;
      dailyProfits: {
        [date: string]: number;
      };
      totalProfit: number;
      salesOfProducts: ProductSale[];
      salesOfAllProducts: CategorySale[];
      profitPercentage: string;
      peakHours: {
        sevenDays: PeakHourData;
        thirtyDays: PeakHourData;
        ninetyDays: PeakHourData;
      };
      revenueHistory: {
        sevenDays: RevenueData;
        thirtyDays: RevenueData;
        ninetyDays: RevenueData;
      };
    };
  }
  export interface ICategory{
   	id: string;
    name: string;
    image_url: string[];
    created_at: Date;
    updated_at: Date;
  }
  export interface ISubCategory{
    id: string;
    name: string;
    category_id: string;
    image_url: string[];
    created_at: Date;
    updated_at: Date;
  }
  export interface ICoupon {
    id: string;
      code: string;
      is_one_time: boolean;
      expires_on: Date;
      no_of_uses: number;
      meta_data: Record<string, string>;
      created_at: Date;
      updated_at: Date;
  }
  
  export interface IProduct {
    id: string;
      name: string;
      description: string;
      price: number;
      image_url: string[];
      category_id: string;
      subcategory_id: string;
      meta_data: Record<string, string>;
      is_active: boolean;
      availability_count: number;
      created_at: Date;
      updated_at: Date;
  }
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  selfie: string;
  aadhar_card: string;
  pan_card: string;
  account_details: {
    "ifsc code": string;
    "account number": string;
    "account holder name": string;
  };
  services: Record<string, string>;
  email: string;
  status: "pending" | "Approved" | "Blocked";
  requested_at: string;
  approved_at: string | null;
}

export interface ServiceProvidersResponse {
  service_providers: ServiceProvider[];
}

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  picture: string;
  ip_address: string;
  status: string;
  last_login: string;
  created_at: string;
  metadata: string;
}

export interface UsersResponse {
  total_users: number;
  users: User[];
}

export interface UpdateStatusRequest {
  id: string;
  status: "Approved" | "Blocked";
}

export interface UpdateStatusResponse {
  message: string;
}

class ApiService {
  private baseUrl = {
    login: 'https://rlvze63eac.execute-api.ap-southeast-2.amazonaws.com/default/sc01',
    providers: 'https://7c2awsljvh.execute-api.ap-southeast-2.amazonaws.com/default/sc03',
    users: 'https://0ek3p4mqyl.execute-api.ap-southeast-2.amazonaws.com/default/sc02'
  };

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(this.baseUrl.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('adminToken', data.token);
    return data;
  }

  async getServiceProviders(): Promise<ServiceProvidersResponse> {
    const response = await fetch(this.baseUrl.providers, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch service providers');
    }

    return response.json();
  }

  async updateProviderStatus(request: UpdateStatusRequest): Promise<UpdateStatusResponse> {
    const response = await fetch(this.baseUrl.providers, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to update provider status');
    }

    return response.json();
  }

  async getUsers(): Promise<UsersResponse> {
    const response = await fetch(this.baseUrl.users, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  logout() {
    localStorage.removeItem('adminToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }
}

export const apiService = new ApiService();
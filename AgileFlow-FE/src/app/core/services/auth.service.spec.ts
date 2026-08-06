import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null token when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should store token after login', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      name: 'Admin User',
      email: 'admin@agileflow.com'
    };

    service.login({ email: 'admin@agileflow.com', password: 'Admin123!' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.getToken()).toBe('fake-jwt-token');
  });

  it('should clear token after logout', () => {
    localStorage.setItem('agileflow_token', 'some-token');
    service.logout();
    expect(service.getToken()).toBeNull();
  });

  it('should return user after login', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      name: 'Admin User',
      email: 'admin@agileflow.com'
    };

    service.login({ email: 'admin@agileflow.com', password: 'Admin123!' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    const user = service.getUser();
    expect(user?.name).toBe('Admin User');
    expect(user?.email).toBe('admin@agileflow.com');
  });
});

package com.travelplanner.auth.dto;

public class AuthResponse {
    private String message;
    private String email;
    private String name;
    private String token; // JWT token

    public AuthResponse(String message, String email, String name, String token) {
        this.message = message;
        this.email = email;
        this.name = name;
        this.token = token;
    }
    
    // Getters & setters

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}    
}

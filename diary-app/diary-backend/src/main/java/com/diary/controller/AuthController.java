package com.diary.controller;

import com.diary.config.ApiResponse;
import com.diary.entity.User;
import com.diary.service.JwtService;
import com.diary.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ApiResponse<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");
            String nickname = request.get("nickname");

            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                return ApiResponse.error(400, "Username and password required");
            }

            User user = userService.registerUser(username, email, password, nickname != null ? nickname : username);
            
            String token = jwtService.generateToken(user.getId(), user.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("avatar", user.getAvatar());
            response.put("token", token);

            return ApiResponse.success(response, "Registration successful");
        } catch (RuntimeException e) {
            log.error("Registration error: {}", e.getMessage());
            return ApiResponse.error(400, e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
                return ApiResponse.error(400, "Username and password required");
            }

            User user = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!userService.verifyPassword(password, user.getPassword())) {
                return ApiResponse.error(400, "Invalid password");
            }

            String token = jwtService.generateToken(user.getId(), user.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("avatar", user.getAvatar());
            response.put("token", token);

            return ApiResponse.success(response, "Login successful");
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ApiResponse.error(400, "Invalid credentials");
        }
    }

    @GetMapping("/profile")
    public ApiResponse<User> getProfile() {
        try {
            Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getPrincipal();
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ApiResponse.success(user);
        } catch (Exception e) {
            log.error("Get profile error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get profile");
        }
    }

    @PutMapping("/profile")
    public ApiResponse<User> updateProfile(@RequestBody User updateData) {
        try {
            Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getPrincipal();
            User user = userService.updateUser(userId, updateData);
            return ApiResponse.success(user, "Profile updated");
        } catch (Exception e) {
            log.error("Update profile error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to update profile");
        }
    }
}

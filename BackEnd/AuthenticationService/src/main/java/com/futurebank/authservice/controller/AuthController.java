package com.futurebank.authservice.controller;

import com.futurebank.authservice.model.User;
import com.futurebank.authservice.dto.ChangePasswordDTO;
import com.futurebank.authservice.dto.UpdatePersonalDetailsDTO;
import com.futurebank.authservice.dto.UserDto;
import com.futurebank.authservice.security.TokenProvider;
import com.futurebank.authservice.service.UserService;

import java.util.Collections;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public AuthController(UserService userService, AuthenticationManager authenticationManager,
            TokenProvider tokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody User user) throws Exception {
        logger.info("Attempting to register user with email: {}", user.getEmail());
        User registeredUser = userService.registerUser(user);
        UserDto userDto = toUserDto(registeredUser);
        logger.info("User registered successfully: {}", user.getEmail());
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("Authentication successful for user: {}", loginRequest.getUsername());
        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new LoginResponse(true, "Login successful", jwt));
    }

    @GetMapping("/current_user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthenticated access attempt to /current_user");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Not authenticated"));
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        logger.debug("Fetching current user details for: {}", username);

        User user = userService.findByUsername(username)
                .orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("error", "User not found"));
        }

        return ResponseEntity.ok(toUserDto(user));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
            Authentication authentication) throws Exception {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found for username: " + username));

        logger.info("Changing password for userId: {}", user.getUserId());
        userService.changePassword(user.getUserId(), changePasswordDTO);

        logger.info("Password changed successfully for userId: {}", user.getUserId());
        return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully"));
    }

    @PostMapping("/update-details")
    public ResponseEntity<Map<String, String>> updatePersonalDetails(
            @Valid @RequestBody UpdatePersonalDetailsDTO updatePersonalDetailsDTO,
            Authentication authentication) throws Exception {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        logger.info("Updating personal details for user: {}", username);

        User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        userService.updatePersonalDetails(user.getUserId(), updatePersonalDetailsDTO);
        return ResponseEntity.ok(Collections.singletonMap("message", "Personal details updated successfully"));
    }

    private UserDto toUserDto(User user) {
        return new UserDto(
                user.getUserId(),
                user.getAccountType(),
                user.getCurrencyType(),
                user.getPrefix(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getDob(),
                user.getStreetAddress(),
                user.getStreetAddress2(),
                user.getCity(),
                user.getStateProvince(),
                user.getPostalZipCode(),
                user.getAdhaarNumber(),
                user.getCountry(),
                user.getCitizenship(),
                user.getMaritalStatus(),
                user.getOccupation(),
                user.getEmployerName(),
                user.getUsername(),
                user.getEmail(),
                user.getAccountNumber());
    }
}

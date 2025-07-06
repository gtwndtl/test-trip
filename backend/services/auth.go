package services

import (
    "errors"
    "time"

    jwt "github.com/dgrijalva/jwt-go"
)

// JwtWrapper wraps the signing key and the issuer
type JwtWrapper struct {
    SecretKey       string
    Issuer          string
    ExpirationHours int64
}

// JwtClaim adds email and user_id as a claim to the token
type JwtClaim struct {
    Email  string `json:"email"`
    UserID uint   `json:"user_id"` // ✅ เพิ่ม user_id
    jwt.StandardClaims
}

// GenerateToken generates a jwt token with email and user_id
func (j *JwtWrapper) GenerateToken(email string, userID uint) (signedToken string, err error) {
    claims := &JwtClaim{
        Email:  email,
        UserID: userID, // ✅ ใส่ user_id
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Add(time.Hour * time.Duration(j.ExpirationHours)).Unix(),
            Issuer:    j.Issuer,
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    signedToken, err = token.SignedString([]byte(j.SecretKey))
    return
}

// ValidateToken validates the jwt token and returns the claims
func (j *JwtWrapper) ValidateToken(signedToken string) (claims *JwtClaim, err error) {
    token, err := jwt.ParseWithClaims(
        signedToken,
        &JwtClaim{},
        func(token *jwt.Token) (interface{}, error) {
            return []byte(j.SecretKey), nil
        },
    )

    if err != nil {
        return
    }

    claims, ok := token.Claims.(*JwtClaim)
    if !ok {
        err = errors.New("Couldn't parse claims")
        return
    }

    if claims.ExpiresAt < time.Now().Unix() {
        err = errors.New("JWT is expired")
        return
    }
    return
}

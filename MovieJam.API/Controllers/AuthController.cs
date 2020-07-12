using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MovieJam.API.Data;
using MovieJam.API.Dtos;
using MovieJam.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Text;
using System;
using System.Collections.Generic;

namespace MovieJam.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly IAuthRepository _auth;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepository auth, IConfiguration config)
        {
            _auth = auth;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserToRegisterDto userToRegisterDto)
        {
            userToRegisterDto.Username = userToRegisterDto.Username.ToLower();

            if(await _auth.UserExists(userToRegisterDto.Username))
            {
                return BadRequest("User already exists");
            }

            var userToCreate = new User
            {
                Name = userToRegisterDto.Username
            };
            var userCreated = await _auth.Register(userToCreate, userToRegisterDto.Password);

            return await Login(new 
                UserToLoginDto{UserName = userToCreate.Name, Password = userToRegisterDto.Password}
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserToLoginDto userToLoginDto)
        {
            var user = await _auth.Login(userToLoginDto.UserName.ToLower(), userToLoginDto.Password);

            if(user == null)
            {
                return Unauthorized();
            }

            // Defining the payload of token(can be seen by anyone so don't put sensitive content)
            var claims = new[]
            {
                new Claim(System.Security.Claims.ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(System.Security.Claims.ClaimTypes.Name, user.Name)
            };

            // using the secret key
            var key = new SymmetricSecurityKey(Encoding.ASCII
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            // encrypting the key using HMACSHA512Signature ALgorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Creating token descriptor containing the claims, creds and expiry date
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            // Creating token handler to create token 
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new{
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}
using System;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieJam.API.Data;
using MovieJam.API.Dtos;
using MovieJam.API.Models;

namespace MovieJam.API.Controllers
{
    [ApiController]
    [Route("{controller}")]
    [Authorize]
    public class CartController: ControllerBase
    {
        private readonly DataContext _context;

        public CartController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("addToCart")]
        public async Task<IActionResult> AddToCart(CartItemDto cartItemDto)
        {
            var cartOrder = await _context.Cart.FirstOrDefaultAsync(c => 
                c.UserId == cartItemDto.UserId && c.Placed == false);

            if(cartOrder == null)
            {
                var cart = new Cart
                {
                    CartCollectionId = Guid.NewGuid().ToString(),
                    DateStamp = DateTime.Now,
                    Placed = false,
                    UserId = cartItemDto.UserId
                };
                var cartCollection = new CartCollection
                {
                    CartCollectionId = cart.CartCollectionId,
                    MovieId = cartItemDto.MovieId
                };
                await _context.Cart.AddAsync(cart);
                await _context.CartCollection.AddAsync(cartCollection);

                await _context.SaveChangesAsync();
            }
            else
            {
                var cartCollection = new CartCollection
                {
                    CartCollectionId = cartOrder.CartCollectionId,
                    MovieId = cartItemDto.MovieId
                };

                await _context.CartCollection.AddAsync(cartCollection);

                await _context.SaveChangesAsync();
            }

            return StatusCode(201);
        }

        [HttpPost("removeMovie")]
        public async Task<IActionResult> RemoveMovie(CartItemDto cartItemDto)
        {
            var cartItem = await _context.Cart.SingleOrDefaultAsync(c => 
                c.UserId == cartItemDto.UserId && c.Placed == false);

            if(cartItem == null)
            {
                return NotFound("Item not found");
            }
            var cartCollectionId = cartItem.CartCollectionId;

            var itemToRemove = await _context.CartCollection.SingleOrDefaultAsync(c =>
                c.CartCollectionId == cartCollectionId && c.MovieId == cartItemDto.MovieId);

            _context.CartCollection.Remove(itemToRemove);

            return Ok("Item removed Successfully");
        }
    }
}
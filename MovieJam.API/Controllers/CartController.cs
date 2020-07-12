using System;
using System.Linq;
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
            
            var movie = await _context.Movies.SingleOrDefaultAsync(m => m.Id == cartItemDto.MovieId);
            float moviePrice = 0;
            if(movie == null){
                return NotFound("Requested movie does not exist");
            }
            else{
                moviePrice = movie.MoviePrice;
            }

            if(cartOrder == null)
            {
                var cart = new Cart
                {
                    CartCollectionId = Guid.NewGuid().ToString(),
                    DateStamp = DateTime.Now,
                    Placed = false,
                    UserId = cartItemDto.UserId,
                    TotalPrice = moviePrice
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
                var cartCollectionItem = await _context.CartCollection.SingleOrDefaultAsync(cc => 
                    cc.CartCollectionId == cartOrder.CartCollectionId && cc.MovieId == cartItemDto.MovieId);

                if(cartCollectionItem != null){
                    return StatusCode(403, "Item already exists in cart");
                }

                await _context.Cart.ForEachAsync(c => {
                    if(c.CartCollectionId == cartOrder.CartCollectionId){
                        c.TotalPrice += moviePrice;
                    }
                });

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

        [HttpPost("myorders")]
        [AllowAnonymous]
        public async Task<IActionResult> OrdersInCart(string userId)
        {
            int id = Int32.Parse("1");
            var cartItem = await _context.Cart.SingleOrDefaultAsync(c => 
                c.UserId == id && c.Placed == false);

            if(cartItem == null)
            {
                return Ok(userId);
            }
            
            var cartCollectionItems = await _context.CartCollection.Where(c => 
                c.CartCollectionId == cartItem.CartCollectionId).ToListAsync();
            
            // var orderedMovies = cartCollectionItems.Select(c => c.MovieId);

            return Ok(cartCollectionItems);
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
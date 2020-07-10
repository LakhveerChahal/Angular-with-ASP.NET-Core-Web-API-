using System;

namespace MovieJam.API.Models
{
    public class Cart
    {
        public int CartId { get; set; }
        public int UserId { get; set; }
        public string CartCollectionId { get; set; }
        public DateTime DateStamp { get; set; }
        public Boolean Placed { get; set; }
    }
}
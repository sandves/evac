/**
  * JavaScript implementation of Trilateration to find the position of a
  * point (P4) from three known points in 3D space (P1, P2, P3) and their
  * distance from the point in question.
  *
  * The solution used here is based on the derivation found on the Wikipedia
  * page of Trilateration: https://en.wikipedia.org/wiki/Trilateration
  *
  * This library does not need any 3rd party tools as all the non-basic
  * geometric functions needed are declared inside the trilaterate() function.
  *
  * See the GitHub page: https://github.com/gheja/trilateration.js
  */

/**
  * Calculates the coordinates of a point in 3D space from three known points
  * and the distances between those points and the point in question.
  *
  * If no solution found then null will be returned.
  *
  * If two solutions found then both will be returned, unless the fourth
  * parameter (return_middle) is set to true when the middle of the two solution
  * will be returned.
  *
  * @param {Object} p1 Point and distance: { x, y, z, r }
  * @param {Object} p2 Point and distance: { x, y, z, r }
  * @param {Object} p3 Point and distance: { x, y, z, r }
  * @param {bool} return_middle If two solution found then return the center of them
  * @return {Object|Array|null} { x, y, z } or [ { x, y, z }, { x, y, z } ] or null
  */
function trilaterate(p1, p2, p3, returnMiddle)
{
	// based on: https://en.wikipedia.org/wiki/Trilateration
	
	// some additional local functions declared here for
	// scalar and vector operations
	
	function sqr(a)
	{
		return a * a;
	}
	
	function norm(a)
	{
		return Math.sqrt(sqr(a.x) + sqr(a.y) + sqr(a.z));
	}
	
	function dot(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}
	
	function vectorSubtract(a, b)
	{
		return {
			x: a.x - b.x,
			y: a.y - b.y,
			z: a.z - b.z
		};
	}
	
	function vectorAdd(a, b)
	{
		return {
			x: a.x + b.x,
			y: a.y + b.y,
			z: a.z + b.z
		};
	}
	
	function vectorDivide(a, b)
	{
		return {
			x: a.x / b,
			y: a.y / b,
			z: a.z / b
		};
	}
	
	function vectorMultiply(a, b)
	{
		return {
			x: a.x * b,
			y: a.y * b,
			z: a.z * b
		};
	}
	
	function vectorCross(a, b)
	{
		return {
			x: a.y * b.z - a.z * b.y,
			y: a.z * b.x - a.x * b.z,
			z: a.x * b.y - a.y * b.x
		};
	}
	
	var ex, ey, ez, i, j, d, a, x, y, z;
	
	ex = vectorDivide(vectorSubtract(p2, p1), norm(vectorSubtract(p2, p1)));
	
	i = dot(ex, vectorSubtract(p3, p1));
	a = vectorSubtract(vectorSubtract(p3, p1), vectorMultiply(ex, i));
	ey = vectorDivide(a, norm(a));
	ez =  vectorCross(ex, ey);
	d = norm(vectorSubtract(p2, p1));
	j = dot(ey, vectorSubtract(p3, p1));
	
	x = (sqr(p1.r) - sqr(p2.r) + sqr(d)) / (2 * d);
	y = (sqr(p1.r) - sqr(p3.r) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;
	z = Math.sqrt(sqr(p1.r) - sqr(x) - sqr(y));
    // This may be the case if all radical axes are positive in relation to all circles
    if (isNaN(z)) {
        z = Math.sqrt(-(sqr(p1.r) - sqr(x) - sqr(y)));
    }
	
	// no solution found
	if (isNaN(z))
	{
		return null;
	}
	
	a = vectorAdd(p1, vectorAdd(vectorMultiply(ex, x), vectorMultiply(ey, y)));
	var p4a = vectorAdd(a, vectorMultiply(ez, z));
	var p4b = vectorSubtract(a, vectorMultiply(ez, z));
	
	if (z === 0 || returnMiddle)
	{
		return a;
	}
	else
	{
		return [ p4a, p4b ];
	}
}

/*var c1 = { x: 0, y: 9, z: 0, r: 4.61 };
var c2 = { x: 5, y: 11, z: 0, r: 1.34 };
var c3 = { x: 5, y: 7, z: 0, r: 2.78 };

var d = trilaterate(c1, c2, c3, true);
console.log(d);*/

module.exports = {
    trilaterate: trilaterate
};
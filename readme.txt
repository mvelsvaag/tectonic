tectonic plate model based on https://github.com/davidson16807/tectonics.js

dependencies
https://github.com/mrdoob/three.js/
https://github.com/dataarts/dat.gui
https://github.com/mrdoob/stats.js/

Subdivision Algorithm

Vectors A B C form one triangle ABC

calculate the midpoint of each triangle segment

Vector ab = normalize(A + B) //the midpoint between AB
Vector bc = normalize(B + C) //the midpoint between BC
Vector ca = normalize(C + A) //the midpoint between CA

calculate 4 new triangles with the 3 old vectors and 3 new vectors

triangle A,ab,CA
triangle B,bc,ab
triangle C,ca,bc
triangle ab,bc,ca


Pseudo Code

vector v1, v2, v3;

vector v12 = v1.clone().add(v2).normalize();
vector v23 = v2.clone().add(v3).normalize();
vector v31 = v3.clone().add(v1).normalize();
new triangle(v1, v12, v31);
new triangle(v2, v23, v12);
new triangle(v3, v31, v23);
new triangle(v12, v23, v31);











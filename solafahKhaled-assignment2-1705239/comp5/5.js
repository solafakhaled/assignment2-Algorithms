// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Reorganized Code
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed

// note carefully close-to-final source file organization

var _v = [], _e = [];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main()
{
    // create a graph (default undirected)
    // note g no longer a global var
    var g = new Graph();

    // set graph properties - set a suitable label

    g.read_graph(_v, _e); // read the graph 

    g.label = "Figure 3.10 (Levitin, 3rd edition)}";

    g.print_graph();//print the graph 

    g.DFS();//call DFS 

    document.write("<p>", g.dfs_push, "</p>");// write the dfs push order 

    g.BFS();// call BFS 

    document.write("<p>", g.bfs_out, "</p>");//write bfs order 

}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
    // user input fields

    this.label = v.label; // vertex can be labelled

    // more fields to initialize internally

    this.visit = false; // visited field (default false)
    this.adjacent = new List(); // create adjacency list for the vertex 

    // --------------------
    // member methods use functions defined below

    this.adjacentById = adjacentById;

}

// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
    this.vert = []; // vertex list (an array of Vertex objects)
    this.nv; // number of vertices
    this.ne; // number of edges
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.dfs_push = []; // DFS order output
    this.dfs_pop = []; // DFS pop order output array
    this.bfs_out = []; // BFS order output

    // --------------------
    // student property fields next

    this.label = ""; // (fill) identification string to label graph


    // --------------------
    // member methods use functions defined below

    this.read_graph = better_input; // default input reader method
    this.list_vert = list_vert;     //list all vertices 
    this.print_graph = better_output; // (replace) better printer function
    this.add_edge = add_edge;

    this.DFS = DFS; // perform a depth-first search
    this.dfs = dfs; // DFS a connected component
    this.BFS = BFS; // perform a breadth-first search
    this.bfs = bfs; // BFS a connected component


    // --------------------
    // student methods next; implementing functions in student code section at end


}


// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------
function list_vert()
{
	//list all vertices 
    var i=0
    var v;
	
    while ( i < this.nv )
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
            " - ADJACENCY: ", v.adjacentById(), "<br>");
			i++
    }
}

// --------------------
function better_input(v, e) // default graph input method
{
    // set vertex and edge count fields
    this.nv = v.length;
    this.ne = e.length;

    // insert to inner array 
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }

   //add edges to array of edges with pairs u and v 
    for (var i = 0; i < this.ne; i++)
    {
        this.add_edge(e[i].u, e[i].v);
    }

    // undirected reverse insertion 
    if (!this.digraph)
    {
        this.ne = e.length *2;
    }
}

// --------------------
function add_edge(u_i, v_i)
{
    // get source and distination vertices u and v by thier id 
    var u = this.vert[u_i];
    var v = this.vert[v_i];


    // insert the pair to the adjacancy list 

       u.adjacent.insert(v_i);


    // reverse order for undirected graph 

    if (!this.digraph)
    {
        v.adjacent.insert(u_i);
    }

}

// --------------------
function DFS()
{
    // mark all vertices unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }

    // traverse unvisited connected components
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            this.dfs(i);
        }
    }
}

// --------------------
function dfs(v_i)
{
    // get vertex by id and then 
    var v = this.vert[v_i];
    v.visit = true;
    len = this.dfs_push.length;
    this.dfs_push[len] = v_i;

    // traverse any unvisited vertex 
    var c = v.adjacentById();
    for (var j = 0; j < c.length; j++)
    {
        if (!this.vert[c[j]].visit)
        {
            this.dfs(c[j]);
        }
    }

    len_pop = this.dfs_pop.length;
    this.dfs_pop[len_pop] = v_i;
}

// --------------------
function BFS()
{
    // mark all vertices unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }

    // traverse unvisited connected components
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            this.bfs(i);
        }
    }
}

// --------------------
function bfs(v_i)
{
	//create new queue for processing bfs 
	var queue = new Queue();
    // get vertex v by its id
    var v = this.vert[v_i];

    // mark as visited  
    v.visit = true;

    // enqueue v to the queue 
    
    queue.enqueue(v_i);


    // while queue not empty
    while (!queue.isEmpty())
    {

        // 
        var u_i = queue.dequeue();
        var u = this.vert[u_i];
        this.bfs_out[this.bfs_out.length] = u_i; //fill the bfs_out array when dequeu the vertex


        // enqueue all adjacent vertecies to u 
        var c = u.adjacentById();
        for (var i = 0; i < c.length; i++)
        {
            if (!this.vert[c[i]].visit)
            {
                this.vert[c[i]].visit = true;
                queue.enqueue(c[i]);
            }
        }
    }
}

//-----------------------

function better_output() // new default graph output method
{
    document.write("<p>GRAPH {", this.label, "} ", this.digraph ? "" : "UN", "DIRECTED - ", this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");

    // list vertices
    this.list_vert();
}

// --------------------
function adjacentById() // initally just a wrapper for .traverse
{
    return this.adjacent.traverse();
}

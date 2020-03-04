// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Transitive Closure Package
// 2018, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//


var _v = [], _e = [];   // note naming conventions in upload guide


// -----------------------------------------------------------------------

/**
*calls the functions to be executed
*@method _main
*@param
*@returns
*/
function _main()   
{
		// published docs section (ref. assignment page)
	// for this section, strip line comments
	// no JSDOC comments in this section
	
	// base property fields from P1M1
    
   //create new graph
    var g = new Graph();

    //print label
	g.label = 'Exercise 8.4: 7 (Levitin, 3rd edition)';
	//it is a digraph =true 
	g.digraph = true;
	//read graph 
	g.readGraph(_v, _e);
	//print graph
	g.printGraph();
	//perform topological search on the graph 
    g.topoSearch(1);

	document.write("<p>bfs_order: ", g.bfs_order, "</p>");
	document.write("<p>", g.componentInfo(), "</p>");
	//perform transative closure on the graph using DFS
    g.DfsTC();
    document.write("<p> TC matrix by DFS:<br>");
	//print the DFS matrix for transitive closure 
    for (var i = 0; i < g.dfsTC.length; i++)
    {
        document.write(g.dfsTC[i], "<br>");
	}
    
    
    document.write("<p>TC matrix by Warshall-Floyd:<br>");
	//call warshallFloyd for transitive closure
    g.warshallFloyd();
	//print
    for (var i = 0; i < g.warshallTC.length; i++)
    {
        document.write(g.warshallTC[i], "<br>");
	}
	
	document.write("<p>DAG: ", g.isDAG(), "</p>");
	
	//output floyed-distance matrix
    g.warshallFloyd();
    document.write("<p>Distance matrix<br>");

    for (var i = 0; i < g.floydD.length; i++)
    {
        document.write(g.floydD[i], "<br>");
    }
}

/**
*creates new Vertex object
*@method VERTEX
*@param  {Vertex} v - vertex 
*@returns 
*/

// -----------------------------------------------------------------------

function Vertex(v)
{
		// published docs section (ref. assignment page)
	// for this section, strip line comments
	// no JSDOC comments in this section

	
	
	// base property fields
	
	this.label = v.label;	//vertex lable				
	this.visit = false; 	//visited default is false					
    this.adjacent = new List();	//create new list of adjacents of this vertex			
	
	// base member methods
	
	this.adjacentByID = adjacentByIdImpl;  //closest adjacent by id 		
    this.incidentEdges = incidentEdgesImpl;		
    this.vertexInfo = vertexInfoImpl;		 //vertex informations 	
    this.insertAdjacent = insertAdjacentImpl;	
}

// -----------------------------------------------------------------------
/**
*creates new Edge object
*@method Edge
*@param  {Vertex} vert_i - vertex {intger} weight- edge Weight 
*@returns 
*/
function Edge(vert_i,weight)
{
	// base property fields
    this.target_v = vert_i;						
    this.weight = weight;						
}

/**
*creates new graph object
*@method Graph
*@param   
*@returns 
*/
// -----------------------------------------------------------------------

function Graph()
{
		// published docs section (ref. assignment page)
	// for this section, strip line comments
	// no JSDOC comments in this section
	
	// base property fields
    this.vert = [];	//create array of vertices 							
    this.nv = 0;	//number of vertecies							
    this.ne = 0;	//number of edges							
    this.digraph = false;	// not digraph by default 
					
    this.weighted = false;	// not weighted by default 					
    this.dfs_push = [];		//push order array 					
    this.bfs_order = [];	// bfs order array 					
    this.label = "";		//label					
    this.connectedComp = 0;	 					
    this.adjMatrix = [];						
	
	// base member methods
    this.listVerts = listVerts;
    this.readGraph = better_input;
    this.addEdge = addEdge;				
    this.printGraph = printGraph;			
    //check methods : 
    this.dfs = dfsImpl;							
    this.bfs = bfsImpl;							
    this.makeAdjMatrix = makeAdjMatrix;	
    this.isConnected = isConnectedImpl;		
    this.componentInfo = componentInfoImpl;		
    this.topoSearch = topoSearchImpl;			
	
	// transitive closure package 
	
	this.floydD = [];
	this.warshallTC = [];
	this.dfsTC = [];

	// student methods

	this.hasPath =  hasPath;
	this.shortestPath = shortestPath;
	this.isDAG = isDAG;
	this.warshallFloyd = warshallFloydImpl;
	this.DfsTC = dfsTC;
}


// -----------------------------------------------------------------------
// functions used by methods of Graph and ancillary objects

// -----------------------------------------------------------------------
// begin student code section
// -----------------------------------------------------------------------

// transitive closure package 
/**
*check if there is a path between two vertieces
*@method hasPath
*@param  {Vertex} u_i - source vertex ,{Vertex} v_i - distination vertex
*@returns true or false
*/
function hasPath(u_i, v_i)
{
	//check if there is a path between two vertices 
	return this.warshallTC[u_i][v_i] == 1? true : false;
}

/**
*return the shortest path between u and v 
*@method shortestPath
*@param  {Vertex} u_i - source vertex ,{Vertex} v_i - distination vertex
*@returns shortestPath between u and v  
*/

function shortestPath(u_i, v_i)
{
	//returns the shortest path between u and v 
	return this.floydD[u_i][v_i];
}

/**
*check if the graph is dag or not 
*@method isDAG
*@param  
*@returns true or false 
*/
function isDAG()
{
	//check if a specific graph is diracted acyclic graph.
	for (var i = 0, j = 0; i < this.warshallTC.length && j < this.warshallTC.length; i++, j++)
		if (this.hasPath(i, j))
			return false;
	return true;
}

/**
*apply warshall-Floyed to find transative closure matrix 
*@method warshallFloydImpl
*@param  
*@returns 
*/
function warshallFloydImpl()
{
    // implement the ADJACENCY matrix 
       this.makeAdjMatrix();

    //Fill  warshallTC[] and distance matrices (floydD[]) by adjacent matrix
           for (var t = 0; t < this.adjMatrix.length; t++)
    {
        //Copy row by row
        this.warshallTC[t] = this.adjMatrix[t].slice();
        this.floydD[t] = this.adjMatrix[t].slice();
        for (var c = 0; c < this.nv; c++)
        {
            if (this.adjMatrix[t][c] == 0 &&  t!=c)
            {
                this.floydD[t][c] = Infinity;
            }
        }
    }

    // warshall-Floyed algorithm
    for (var k = 0; k < this.floydD.length; k++)
    {
        for (var i = 0; i < this.floydD.length; i++)
        {
            for (var j = 0; j < this.floydD.length; j++)
            {
                this.floydD[i][j] = Math.min(this.floydD[i][j], (this.floydD[i][k] + this.floydD[k][j]));
                this.warshallTC[i][j] = this.warshallTC[i][j] || (this.warshallTC[i][k] && this.warshallTC[k][j])?1:0;
            }
        }
    }

    //change the value from Infinity to 0 (because there is no distance = Infinity)
    for (var i = 0; i < this.floydD.length; i++)  
        for (var j = 0; j < this.floydD.length; j++)     
            if (this.floydD[i][j] == Infinity)         
                this.floydD[i][j] = 0;    

}

/**
*find transative closure by dfs 
*@method dfsTC
*@param  
*@returns 
*/
function dfsTC()
{
    // for each vertex
    for (var i = 0; i < this.nv; i++)
    {
        //current vertex processing 
        var v = this.vert[i];

        // mark all vertices unvisited
        for (var u = 0; u < this.nv; u++)
        {
            this.vert[u].visit = false;
        }

        // starting by the initiation of the row 
        this.dfsTC[i] = [];
        for (var j = 0; j < this.nv; j++)
            this.dfsTC[i][j] = 0;

        //perform DFS search for each adjacent to the vertex v by its ID
        var cv = v.adjacentByID();
        for (var m = 0; m < cv.length; m++)
            this.dfs(cv[m]); //for each adjacent vertex call dfs()

        //traverse the vertices to check which is visited
        for (var n = 0; n < this.nv; n++)
        {
            //if visited set 1 in the corresponding TC matrix
            if (this.vert[n].visit)
            {
                this.dfsTC[i][n] = 1;
            }
        }
    }
}

// -----------------------------------------------------------------------
// published docs section (ref. assignment page)
// use starter6-based P1M1 code as-is (fixes/improvements OK)
// no JSDOC comments in this section (docs already published)
// -----------------------------------------------------------------------
/**
*add new edge to the graph 
*@method addEdgeImp1 
*@param  {Vertex} u_i - source vertex ,{Vertex} v_i - distination vertex
*@returns 
*/
function addEdgeImpl(u_i, v_i)
{
    //fetch vertices using their idm where u: edge source vertex, v: target vertex
    var u = this.vert[u_i],
        v = this.vert[v_i];

    //insert (u,v), i.e. insert v (by id) in adjacency list of u
    u.adjacent.insert(v_i);

    // reverse vertex order and repeate 
    if (!this.digraph)
    {
        v.adjacent.insert(u_i);
    }
}

// --------------------
/**
*add new edge to the graph with informations and weight
*@method addEdgeImp12 
*@param  {Vertex} u_i - source vertex ,{Vertex} v_i - distination vertex
*@returns 
*/
function addEdgeImpl2(u_i, v_i, weight)
{
    // fetch vertex u an v (source and distination) 
    var u = this.vert[u_i],
        v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass object)
    var e = new Edge();
    e.target_v = v_i;
    e.weight = weight;
    u.adjacent.insert(e);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        e = new Edge();
        e.target_v = u_i;
        e.weight = weight;
        v.adjacent.insert(e);
    }
}

// --------------------
/**
*add new edge to the graph with weight
*@method addEdge 
*@param  {Vertex} u_i - source vertex ,{Vertex} v_i - distination vertex
*@returns 
*/
function addEdge(u_i, v_i, weight)
{
    // fetch by id u and v (source and distination)
    var u = this.vert[u_i],
        v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass object)
    u.insertAdjacent(v_i, weight);

    // if undirected repeate reversing order 
    if (!this.digraph)
    {
        v.insertAdjacent(u_i, weight);
    }
}

// --------------------
/**
*find all the adjacent vertecies by id and add it to adjacent Array   
*@method addEdgeImp1 
*@param  
*@returns 
*/
function adjacentByIdImpl()
{
	//initialize adjacency array 
    var adjacentArr = [];
    var adjacency_list = this.adjacent.traverse();
	//fill adjacency array 
    for (var i = 0; i < adjacency_list.length; i++)
    {
        adjacentArr[i] = adjacency_list[i].target_v;
    }
    return adjacentArr;
}
/**
*insert vertices into internal vertex array and pass pairs to create edges 
*@method better_input  
*@param  {Vertex} v  ,{Edge} e 
*@returns 
*/
// --------------------
function better_input(v, e)
{
    //number of edges and verticies  e, v length 
    this.nv = v.length;
    this.ne = e.length;
    // input vertices into internal vertex array
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }
    // input vertex pairs from edge list input array
    // remember to pass vertex ids to add_edge() 
	
    for (var i = 0; i < this.ne; i++)
    {
        this.addEdge(e[i].u, e[i].v, e[i].w);
    }
    // double edge count if graph undirected 
    if (!this.digraph)
    {
        this.ne = e.length*2;
    }
    // check if the graph is weighted or not 
    if (!(e[0].w == undefined))
    {
        this.weighted = true;
    }
}

// --------------------
/**
*print connectivity information output  
*@method better_output 
*@param 
*@returns 
*/
function better_output()
{
    
    var out;
    switch (this.connectedComp)
    {
        case 0:
            out = "no connectivity info";
            break;
        case 1:
            out = "CONNECTED";
            break;
        default:
            out = "DISCONNECTED " + this.connectedComp;
            break;
    }

    document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "" : "UN", "WEIGHTED, ", this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ", this.ne, " EDGES:</p>", out, "</p>");

    // list vertices
    this.list_vert();
}

// --------------------
/**
*traverse using bfs  
*@method bfsImpl 
*@param  {Vertex} v_i - distination vertex
*@returns 
*/

function bfsImpl(v_i)
{
	//create new queue
	var queue = new Queue();
    // get vertex by its id 
    var v = this.vert[v_i];

    // mark vertex as visited 
    v.visit = true;
    this.bfs_order[this.bfs_order.length] = v_i;

    // insert v to the queue 
    
      queue.enqueue(v);

    // while queue not empty
    while (!queue.isEmpty())
    {
        // dequeue and process a vertex, u
        var u = queue.dequeue();

        // queue all unvisited vertices adjacent to u
        var c = u.adjacentByID();
        for (var i = 0; i < c.length; i++)
        {
            if (!this.vert[c[i]].visit)
            {
                this.vert[c[i]].visit = true;
                queue.enqueue(this.vert[c[i]]);
                this.bfs_order[this.bfs_order.length] = c[i];
            }
        }
    }
}

// --------------------
/**
*check connectivity of graph 
*@method addEdgeImp1 
*@param  
*@returns {string} out - print connectivity info 
*/
function componentInfoImpl()
{
    var out;
    switch (this.connectedComp)
    {
        case 0:
            out = "no connectivity info";
            break;
        case 1:
            out = "CONNECTED";
            break;
        default:
            out = "DISCONNECTED " + this.connectedComp;
            break;
    }
    return out;
}

/**
*traverse using dfs  
*@method dfsImpl
*@param {Vertex} v_i - distination vertex
*@returns 
*/
// --------------------
function dfsImpl(v_i)
{
    // get vertex by id 
    var v = this.vert[v_i];

    // mark it as visited 
    v.visit = true;
    this.dfs_push[this.dfs_push.length] = v_i;

    // recursively traverse unvisited adjacent vertices 
    var c = v.adjacentByID();
    for (var i = 0; i < c.length; i++)
    {
        if (!this.vert[c[i]].visit)
        {
            this.dfs(c[i]);
        }
    }
}

// --------------------

function incidentEdgesImpl()
{
    //create an array of objects and fill it 
    var enode = [];
    var w = this.adjacent.traverse();
    for (var i = 0; i < w.length; i++)
    {
        enode[i] = {
            "adjVert_i": w[i].target_v,
            "edgeLabel": "",
            "edgeWeight": w[i].weight
        }
    }
    return enode;
}

// --------------------
function insertAdjacentImpl(v_i, weight)
{
    this.adjacent.insert(new Edge(v_i, weight));
}

// --------------------
function isConnectedImpl()
{
	//check  if it is connected or not 
	if (this.connectedComp ==0 ){
		return true 
	}else{ 
		return false 
	}
    
}

// --------------------
function listVerts()
{
	//list all vertices 
    var i, v; // local variables
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }
}

// --------------------
function makeAdjMatrixImpl()
{
    //adjacency matrix filled with zeros 
    for (var i = 0; i < this.nv; i++)
    {
        this.adjMatrix[i] = [];

        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }
    }

    // change value zero to one 
    var v, w;
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        w = v.adjacentById();
        for (var j = 0; j < w.length; j++)
        {
            this.adjMatrix[i][w[j]] = 1;
        }
    }
}

// --------------------
function makeAdjMatrixImpl2()
{
    for (var i = 0; i < this.nv; i++)
    {
        //get vertex
        var v = this.vert[i];

        //create and initialize with zeros 
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        //process adjacent vertices: get by edge node, set value for each
        var e = v.adjacent.traverse(),
            m = e.length; //note encap mistake
        for (var j = 0; j < m; j++)
        {
            this.adjMatrix[i][e[j].target_v] = this.weighted ? e[j].weight : 1;
        }
    }
}

// --------------------
function makeAdjMatrix()
{
    for (var i = 0; i < this.nv; i++)
    {
        //get vertex
        var v = this.vert[i];

        //create row and fill it with zeros 
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        //set adjacent by 1 
        var e = v.adjacentByID();
        var info = v.incidentEdges();
        for (var j = 0; j < e.length; j++)
        {
            this.adjMatrix[i][e[j]] = this.weighted ? info[j].edgeWeight : 1;
        }
    }
}

// --------------------
function makeGraphImpl(n, m, w)
{

}

// --------------------
function printGraph()
{
    document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "" : "UN", "WEIGHTED, ", this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ", this.ne, " EDGES:</p>", this.componentInfo(), "</p>");

    // list vertices
    this.listVerts();
}

// --------------------
function topoSearchImpl(fun)
{
    // mark all vertices unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }
    // traverse a connected component 	
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            fun == 0 ? (this.connectedComp++, this.dfs(i)) : (this.connectedComp++, this.bfs(i));
        }
    }
}

// --------------------
function vertexInfoImpl()
{
    return " {" + this.label + "} - VISIT: " + this.visit + " - ADJACENCY: " + this.adjacentByID();
}

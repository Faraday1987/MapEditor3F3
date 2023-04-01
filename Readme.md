<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="A_Pathfinding_With_Javascript_Map_Editor_0"></a>A* Pathfinding With Javascript Map Editor</h1>
<h3 class="code-line" data-line-start=1 data-line-end=2 ><a id="_Mapeditor_A__Javascript_Canvas_1"></a>✨ Mapeditor A*  Javascript Canvas✨</h3>
<h4 class="code-line" data-line-start=3 data-line-end=4 ><a id="Ver_online_httpsmapeditor3f3webapp_3"></a>Ver online <a href="https://mapeditor3f3.web.app">https://mapeditor3f3.web.app</a></h4>


<p align="center" >
     <kbd><img img width="600" heigth="600" src="https://res.cloudinary.com/damjgysop/image/upload/v1680421659/mapeditor3_small_u9yyqm.gif" alt="image">
</kbd>
</p>

<pre><code class="has-line-data" data-line-start="8" data-line-end="13" class="language-JAVASCRIPT">    <span class="hljs-comment">// Add node at possition</span>
    addNode(<span class="hljs-number">25</span>, <span class="hljs-number">25</span>);
    <span class="hljs-comment">// Connect Node with ID</span>
    addConnectionById(<span class="hljs-string">"n1"</span>, <span class="hljs-string">"n3"</span>);
</code></pre>
<h3 class="code-line" data-line-start=13 data-line-end=14 ><a id="THE_DOWNLOAD_FILE_13"></a>THE DOWNLOAD FILE</h3>
<pre><code class="has-line-data" data-line-start="15" data-line-end="112" class="language-JSON">{
  "<span class="hljs-attribute">nodes</span>": <span class="hljs-value">[
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n1"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">25</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">25</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n3"</span>,
        <span class="hljs-string">"n2"</span>
      ]
    </span>},
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n2"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">110</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">110</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n1"</span>,
        <span class="hljs-string">"n3"</span>,
        <span class="hljs-string">"n4"</span>
      ]
    </span>},
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n3"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">50</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">180</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n1"</span>,
        <span class="hljs-string">"n2"</span>,
        <span class="hljs-string">"n5"</span>,
        <span class="hljs-string">"n6"</span>
      ]
    </span>},
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n4"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">225</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">90</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n5"</span>,
        <span class="hljs-string">"n2"</span>,
        <span class="hljs-string">"n6"</span>
      ]
    </span>},
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n5"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">190</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">160</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n3"</span>,
        <span class="hljs-string">"n4"</span>
      ]
    </span>},
    {
      "<span class="hljs-attribute">id</span>": <span class="hljs-value"><span class="hljs-string">"n6"</span></span>,
      "<span class="hljs-attribute">x</span>": <span class="hljs-value"><span class="hljs-number">230</span></span>,
      "<span class="hljs-attribute">y</span>": <span class="hljs-value"><span class="hljs-number">170</span></span>,
      "<span class="hljs-attribute">neighbors</span>": <span class="hljs-value">[
        <span class="hljs-string">"n4"</span>,
        <span class="hljs-string">"n3"</span>
      ]
    </span>}
  ]</span>,
  "<span class="hljs-attribute">lines</span>": <span class="hljs-value">[
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n1"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n3"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n1"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n2"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n2"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n3"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n3"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n5"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n5"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n4"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n4"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n2"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n6"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n4"</span>
    </span>},
    {
      "<span class="hljs-attribute">start</span>": <span class="hljs-value"><span class="hljs-string">"n6"</span></span>,
      "<span class="hljs-attribute">end</span>": <span class="hljs-value"><span class="hljs-string">"n3"</span>
    </span>}
  ]
</span>}
</code></pre>
<p class="has-line-data" data-line-start="113" data-line-end="114">MIT</p>
<p class="has-line-data" data-line-start="115" data-line-end="116"><strong>Free Software, Hell Yeah!</strong></p>
###########
Engine
###########

The 3D Engine that powers the site is built upon THREE.JS. It uses JSON5 for external data.

The engine is organized with "states". Each state consists of a set of SceneObjects. The states are defined by a ``string``, usually a URL Path.

******************
How To Use
******************

In order to use the engine, simply add the ``<Canvas>`` JSX component into your app and pass the required props:

.. code-block:: 

    <Canvas>
        page = {history.location.pathname}
        config = {config}
        data = {desktop}
    </Canvas>

**Required Props:**

    ``page``
        The page to load. *eg. '/projects'*. This is passed into the engine as a "state".

    .. attention:: It is advised to just pass in ``history.location.pathname`` from ``createBrowserHistory()``

    ``config``
        Debug JavaScript Object. See :ref:`config.ts (debug) <Config_Debug>`.

    ``data``
        Data JavaScript Object. See :ref:`config.ts (data) <Config_Data>`.

All custom code can be inserted through Behaviours and Animations

.. _Config_Data:

==================
config.ts (data)
==================

This is a JavasScript Object that is passed into Canvas via props and contains all of your custom data.

.. csv-table::
    :header: "Property", "Type", "Description"

    ``PageLoadAnimation``, Function, Function called when all data is loaded. MUST call ``Canvas.initialize()`` when completed.
    ``world``, JSON5, See :ref:`World (JSON5) <JSON5_World>`.
    ``backgroundColor``, Hex Color, Background color.
    ``meshes``, JSON5, See :ref:`Meshes (JSON5) <JSON5_Meshes>`.
    ``glbs``, JSON5,  See :ref:`GLBs (JSON5) <JSON5_GLBs>`.
    ``behaviours``, "Array of {string, function} objects", See :ref:`Behaviours <Behaviours>`.
    ``state_startingAnimations``, JSON Object, Animations to play when entering a state. WIP. (What is this???)
.. _Config_Debug:

==================
config.ts (debug)
==================
This is a JavaScript Object that is passed into Canvas via props and determines debug settings.

.. csv-table::
    :header: "Setting", "Description"

    ``CONTROLS``, Enables Camera Movement via Mouse.
    ``DEBUG_MODE``, "Enables a 'debug' mode to move, resize, and rotate objects."
    ``SHOW_SCROLL``, Shows the scroll percentage.
    ``SCROLL_SNAP``, Snaps Scroll percentage to clean percents.


******************
Engine Structure
******************

The Engine is contained entirely within a React JSX Component named ``<Canvas>``.

The ``Canvas`` contains a ``Scene`` which contains a ``World``. They all contain upwards references so everything in the engine can be accessed.

.. attention::
    ``Scene`` and ``THREE.Scene`` are two different things. ``Scene`` contains a ``THREE.Scene``.

Maybe insert a UML here.

==================
Canvas
==================

The canvas object is the importable component that bridges the HTML and the THREE.JS code.

It contains a :ref:`Scene <Scene>` object and a :ref:`TextLayer <TextLayer>` object. 

.. _Scene:

==================
Scene
==================

The scene object is responsible for setting up all of the preliminary THREE.JS code. This includes: a ``THREE.Scene``, ``THREE.PerspeciveCamera``, ``THREE.WebGLRenderer``, and ``OrbitControls``.

The scene object does not contain the actual objects and positioning; rather, it is the ``World`` object which contains all of those.

Scene.MoveCamera(angle : CameraAngle, animeParams: anime.animeParams)
    Moves the camera to the specified angle.

.. _World:

==================
World
==================

The world object contains all of the actual 3D Objects as well as maps to all resources.

.. attention::
    World contains a ``sceneObjects`` array containing all added SceneObjects. This is different from it's ``children`` property, which comes from it's extension to ``THREE.Group`` and contains ``THREE.Object3D``\s.

    Don't append to either of these arrays directly. Use the ``AddObject()`` function.


.. csv-table::
    :header: "Property", "Description"

    ``materials``, "A map of all THREE.JS materials"
    ``geometries``, "A map of all THREE.JS geometries"
    ``keyObjects``, "A map of all addable objects."
    ``behaviours``, "A ``BehaviourFactory`` map, that returns behaviours (to be appened to :ref:`SceneObjects <SceneObject>`)"
    ``worldStates``, "An array of all possible states."
    ``externalMeshes``, "Externally loaded ``THREE.Object3D``\s loaded by the GLBLoader and ExternalMeshLoader. "

World.AddObject()
    Given an object key, add object.

World.ResetObject()
    WIP

World.DeleteObject()
    WIP

World.GetState()
    WIP

World.GetSceneObjectById()
    WIP

.. _SceneObject:

SceneObject
-----------

SceneObjects wrap a ``THREE.Object3D``. 

SceneObject.mesh
    WIP

SceneObject.innerMesh
    WIP

SceneObject.FindBehaviour()
    WIP

.. _Behaviours:

Behaviours
----------
The World Object's ``Behaviours`` Property is fundamentally a Map whose key/value pairs are taken from  :ref:`Config (Data) <Config_Data>`'s behaviours list.

The keys are strings representing the name of the behaviour. The values are Factory functions that return a new instance of that specific :ref:`Behaviour <Behaviour>` class.

.. _Behaviour:

Behaviour
^^^^^^^^^
WIP

For Writing Behaviour Code, see :doc:`WritingBehaviours`

Loaders
---------
Loaders are responsible for importing external material into the engine. They are managed by the ``LoaderManager`` class.

Explain Each Loader. WIP

States
-------------
States contain sets of SceneObjects. They are defined in a World.JSON5.

StateSettings Interface WIP

.. _TextLayer:

==================
TextLayer
==================

The Text Layer is a ``<div>`` that is placed above the ``<canvas>`` element.

It is accessible from the ``Canvas`` object and therefore is linked to 3D space.

WIP

DOMText
-------
A behaviour which uses the TextLayer to render HTML onto the screen. Extend this class for easy HTML text insertion.

WIP

Projection Text
---------------
A behaviour which uses the TextLayer to render HTML that is positioned relative to 3D space. Extend this class for easy 3D HTML text insertion.

WIP

*************
JSON5 Formats
*************

The following are the formats of each JSON5 object.

.. _JSON5_World:

=====
World
=====

WIP

.. _JSON5_Meshes:

======
Meshes
======

WIP

.. _JSON5_GLBs:

====
GLBs
====

WIP
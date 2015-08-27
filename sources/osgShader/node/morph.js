define( [
    'osg/Utils',
    'osg/Texture',
    'osgShader/utils',
    'osgShader/node/Node'
], function ( MACROUTILS, Texture, ShaderUtils, Node ) {
    'use strict';

    var MorphNode = function () {
        Node.apply( this );
    };

    MorphNode.prototype = MACROUTILS.objectInherit( Node.prototype, {
        type: 'Morph',
        validInputs: [ 'weights', 'vertex', 'target1', /*'target2','target3','target4'*/ ],
        validOutputs: [ 'out' ],

        globalFunctionDeclaration: function () {
            var inp = this._inputs;
            var weightVec = inp.weights.getVariable();
            var vertex = inp.vertex.getVariable();
            var weightVar = 'weightsTarget';
            var f = function ( e ) {
                return e.lastIndexOf( 'target' ) === 0;
            };
            var g = function ( e, i ) {
                return weightVar + '[' + i + ']';
            };
            var t = function ( e, i ) {
                return vertex + '_' + ( i + 1 );
            };
            var targets = Object.keys( inp ).filter( f ).map( t );
            var weights;
            var args = function ( e ) {
                return 'const in vec3 ' + e;
            };
            var h = function ( e, i ) {
                return e + ' * ' + weights[ i ];
            };


            var str = 'vec3 morphTransform( const in vec4 weightsTarget,  const in vec3 vertex, ' + targets.map( args ).join( ', ' ) + ' ) { \n';
            str += '\tif( length( weightsTarget ) == 0.0 ) return vertex;\n';
            if ( targets.length > 1 ) {
                weightVar = 'weight';
                str += '\tvec4 weight = normalize( ' + weightVec + ' );\n';
            }
            weights = targets.map( g );
            return str += '\treturn ' + vertex + '* (1.0 - (' + weights.join( ' + ' ) + ')) + ' + targets.map( h ).join( ' + ' ) + ';' + '\n}';
        },

        computeShader: function () {
            var inputs = [ this._inputs.weights, this._inputs.vertex ];
            for ( var i = 1; i <= 4; i++ ) {
                if ( !this._inputs[ 'target' + i ] ) break;
                inputs.push( this._inputs[ 'target' + i ] );
            }

            return ShaderUtils.callFunction( 'morphTransform', this._outputs.out, inputs );
        }
    } );

    return {
        MorphNode: MorphNode
    };

} );

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
        validInputs: [ 'weights', 'vertex', 'target1' ],
        validOutputs: [ 'out' ],

        globalFunctionDeclaration: function () {
            return '#pragma include "morph.glsl"';
        },

        computeShader: function () {
            // var inp = this._inputs;
            // var weights = inp.weights.getVariable();
            // var vertex = inp.vertex.getVariable();
            // var targets = inp.targets;

            // var str = 'if( length(' + weights + ') == 0.0 ) return ' + vertex + ';\n';
            // str += 'vec4 weight = normalize( ' + weights + ' )\n';

            // str += 'return ' + vertex + '(1.0 - (' + weights + '[0]';

            // var i = 0;
            // var nbTargets = targets.length;
            // for ( i = 1; i < nbTargets; ++i )
            //     str += '+' + weights + '[' + i + ']';

            // str += ')) + ' + weights + '[0] * ' + targets[ 0 ].getVariable();

            // for ( i = 1; i < nbTargets; ++i )
            //     str += '+ ' + weights + '[' + i + '] * ' + targets[ i ].getVariable();

            // str += ';';

            if ( this._inputs.target4 )
                return ShaderUtils.callFunction( 'morphTransform4', this._outputs.out, [ this._inputs.weights, this._inputs.vertex, this._inputs.target1, this._inputs.target2, this._inputs.target3, this._inputs.target4 ] );
            if ( this._inputs.target3 )
                return ShaderUtils.callFunction( 'morphTransform3', this._outputs.out, [ this._inputs.weights, this._inputs.vertex, this._inputs.target1, this._inputs.target2, this._inputs.target3 ] );
            if ( this._inputs.target2 )
                return ShaderUtils.callFunction( 'morphTransform2', this._outputs.out, [ this._inputs.weights, this._inputs.vertex, this._inputs.target1, this._inputs.target2 ] );
            if ( this._inputs.target1 )
                return ShaderUtils.callFunction( 'morphTransform1', this._outputs.out, [ this._inputs.weights, this._inputs.vertex, this._inputs.target1 ] );
        }
    } );

    return {
        MorphNode: MorphNode
    };

} );

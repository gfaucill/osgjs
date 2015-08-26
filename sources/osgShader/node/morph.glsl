vec3 morphTransform1( const in vec4 weightsTarget, const in vec3 vertex, const in vec3 target1 )
{
    if( length(weightsTarget) == 0.0 ) return vertex;
    return vertex * ( 1.0 - weightsTarget.x ) + weightsTarget.x * target1;
}

vec3 morphTransform2( const in vec4 weightsTarget, const in vec3 vertex, const in vec3 target1,
    const in vec3 target2 )
{
    if( length(weightsTarget) == 0.0 ) return vertex;
    vec4 weight = normalize( weightsTarget );
    return vertex * ( 1.0 - (weight.x + weight.y ) ) + weight.x * target1 + weight.y * target2;
}

vec3 morphTransform3( const in vec4 weightsTarget,  const in vec3 vertex, const in vec3 target1,
    const in vec3 target2, const in vec3 target3 )
{
    if( length(weightsTarget) == 0.0 ) return vertex;
    vec4 weight = normalize( weightsTarget );
    return vertex * ( 1.0 - (weight.x + weight.y + weight.z) ) + weight.x * target1 + weight.y * target2 + weight.z * target3;
}

vec3 morphTransform4( const in vec4 weightsTarget, const in vec3 vertex, const in vec3 target1,
    const in vec3 target2, const in vec3 target3, const in vec3 target4 )
{
    if( length(weightsTarget) == 0.0 ) return vertex;
    vec4 weight = normalize( weightsTarget );
    return  vertex * ( 1.0 - (weight.x + weight.y + weight.z+weight.w) )  + weight.x * target1 + weight.y * target2 + weight.z * target3 + weight.w * target4;
}

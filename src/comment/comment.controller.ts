import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt.guard";
import { SuccessInterceptor } from "../../src/aop/interceptors/success.interceptor";
import { HttpExceptionFilter } from "../../src/aop/exception/http-exception.filter";
import { CurrentUser } from "../../src/aop/decorators/user.decorator";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { LikeCommentDto } from "./dto/like-comment.dto";

@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@ApiTags("COMMENT")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("/get/:postIdx")
  findAllComment(@Param("postIdx") postIdx: number) {
    console.log(postIdx);
    return this.commentService.findAllComment(postIdx);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: UserLoginDto
  ) {
    const { postIdx, parentCommentIdx, depth, commentContent } =
      createCommentDto;
    return this.commentService.createComment(
      postIdx,
      user.userIdx,
      parentCommentIdx,
      depth,
      commentContent
    );
  }

  @Post()
  modifyComment(@Body() createCommentDto: CreateCommentDto) {
    const { postIdx, commentContent } = createCommentDto;
    return this.commentService.modifyComment(postIdx, commentContent);
  }

  @Post()
  removeComment(@Body() commentIdx: string) {
    return this.commentService.removeComment(commentIdx);
  }

  @ApiOperation({ summary: "게시물 좋아요" })
  //@UseGuards(JwtAuthGuard)
  @Post("/likeComment")
  commentLike(@Body() Idx: LikeCommentDto) {
    const { userIdx, postIdx, commentIdx } = Idx;
    return this.commentService.commentLike(userIdx, postIdx, commentIdx);
  }

  @ApiOperation({ summary: "게시물 좋아요 취소" })
  //@UseGuards(JwtAuthGuard)
  @Post("/likeCancelComment")
  commentLikeCancel(@Body() Idx: LikeCommentDto) {
    const { userIdx, postIdx, commentIdx } = Idx;
    return this.commentService.postLikeCancel(userIdx, postIdx, commentIdx);
  }
}
